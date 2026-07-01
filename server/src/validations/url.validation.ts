import z from "zod";

export const urlSchema=z.object({
    original_url:z.url({error:"Invalid URL"}),
    expires_at:z.iso.datetime().optional()
})

export const updateUrlSchema=z.object({
    original_url:z.url({error:"Invalid URL"}).optional(),
    expires_at:z.iso.datetime().optional()
})

