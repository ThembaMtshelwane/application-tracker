import type { Model} from "mongoose";

export interface PaginationParams {
  page?: string | number;
  limit?: string | number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  search?: string;
  [key: string]: any; // Additional filter params
}

export interface SearchConfig {
  fields: string[]; // Fields to search across
}

export interface PaginationConfig<T> {
  searchFields?: string[]; // Fields for text search
  filterableFields?: string[]; // Fields that can be filtered
  dateRangeFields?: string[]; // Fields that support date range filtering
  selectFields?: string; // Fields to select/exclude
  defaultSortBy?: string;
  defaultSortOrder?: "asc" | "desc";
  maxLimit?: number;
  populateOptions?: any; // Mongoose populate options
}

export interface PaginationResult<T> {
  success: boolean;
  data: T[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalCount: number;
    limit: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
  filters: Record<string, any>;
  sort: {
    sortBy: string;
    sortOrder: string;
  };
}

export const paginate = async <T>(
  model: Model<T>,
  params: PaginationParams,
  config: PaginationConfig<T> = {}
): Promise<PaginationResult<T>> => {
  const {
    searchFields = [],
    filterableFields = [],
    dateRangeFields = [],
    selectFields = "",
    defaultSortBy = "createdAt",
    defaultSortOrder = "desc",
    maxLimit = 100,
    populateOptions = null,
  } = config;

  // Parse pagination params
  const page = Math.max(1, parseInt(String(params.page || "1")));
  const limit = Math.min(
    maxLimit,
    Math.max(1, parseInt(String(params.limit || "10")))
  );
  const skip = (page - 1) * limit;

  const sortBy = params.sortBy || defaultSortBy;
  const sortOrder = params.sortOrder || defaultSortOrder;

  // Build filter object
  const filter: any = {};

  // Handle text search
  if (params.search && searchFields.length > 0) {
    filter.$or = searchFields.map((field) => ({
      [field]: { $regex: params.search, $options: "i" },
    }));
  }

  // Handle filterable fields
  filterableFields.forEach((field) => {
    if (params[field] !== undefined && params[field] !== "") {
      // Handle boolean fields
      if (params[field] === "true" || params[field] === "false") {
        filter[field] = params[field] === "true";
      } else {
        filter[field] = params[field];
      }
    }
  });

  // Handle date range fields
  dateRangeFields.forEach((field) => {
    const afterParam = `${field}After`;
    const beforeParam = `${field}Before`;

    if (params[afterParam] || params[beforeParam]) {
      filter[field] = {};
      if (params[afterParam]) {
        filter[field].$gte = new Date(params[afterParam]);
      }
      if (params[beforeParam]) {
        filter[field].$lte = new Date(params[beforeParam]);
      }
    }
  });

  // Build sort object
  const sort: any = {};
  sort[sortBy] = sortOrder === "asc" ? 1 : -1;

  // Build query
  let query = model.find(filter).sort(sort).skip(skip).limit(limit);

  // Add select fields if specified
  if (selectFields) {
    query = query.select(selectFields);
  }

  // Add populate if specified
  if (populateOptions) {
    query = query.populate(populateOptions);
  }

  // Execute query with count
  const [data, totalCount] = await Promise.all([
    query.lean(),
    model.countDocuments(filter),
  ]);

  // Calculate pagination metadata
  const totalPages = Math.ceil(totalCount / limit);
  const hasNextPage = page < totalPages;
  const hasPrevPage = page > 1;

  // Extract applied filters (excluding pagination/sort params)
  const appliedFilters: Record<string, any> = {};
  const excludedParams = ["page", "limit", "sortBy", "sortOrder"];

  Object.keys(params).forEach((key) => {
    if (!excludedParams.includes(key) && params[key] !== undefined) {
      appliedFilters[key] = params[key];
    }
  });

  return {
    success: true,
    data: data as T[],
    pagination: {
      currentPage: page,
      totalPages,
      totalCount,
      limit,
      hasNextPage,
      hasPrevPage,
    },
    filters: appliedFilters,
    sort: {
      sortBy,
      sortOrder,
    },
  };
};
