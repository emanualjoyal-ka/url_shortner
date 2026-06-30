export type CreateUrlDTO={
    original_url:string;
    expires_at?:Date;
}

export type CreateUrlRepositoryDTO=CreateUrlDTO & {
    user_id:string;
    short_code:string;
}

export type UrlResponseDTO={
    short_code:string;
    short_url:string;
    original_url:string;
    expires_at?:Date;
}

export type CreateClickEventDTO={
    url_id:string;
    clicked_at:Date;
    ip_address?:string | null;
    browser?:string | null; 
    operating_system?:string | null;
    device_type?:string | null;
    user_agent?:string | null;
    referrer?:string | null;
}

export type GetAllUrlsAdminDTO={
    page:number;
    limit:number;
}

export type GetAllUrlsDTO=GetAllUrlsAdminDTO & {
    userId:string;
}

export type AdminUrlResponseDTO= {
  original_url: string;
  short_code: string;
  clicks: number;
  created_at: Date;
  updated_at: Date;
}