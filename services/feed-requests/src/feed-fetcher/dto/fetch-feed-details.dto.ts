export interface FetchFeedDetailsDto {
  requestStatus:
    | 'INTERNAL_ERROR'
    | 'BAD_STATUS_CODE'
    | 'SUCCESS'
    | 'PENDING'
    | 'FETCH_ERROR'
    | 'PARSE_ERROR'
    | 'FETCH_TIMEOUT'
    | 'REFUSED_LARGE_FEED'
    | 'MATCHED_HASH';
  response?: {
    hash?: string | null;
    statusCode: number;
    body?: string;
  };
}
