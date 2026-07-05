
variable "cloudflare_account_id"{
    description = "The Cloudflare account ID to use for the resources."
    type        = string
}

variable "cloudflare_api_token" {
    description = "The Cloudflare API token to use for authentication."
    type        = string
    sensitive   = true
}

variable "bucket_name" {
    description = "The name of the R2 bucket to create."
    type        = string
}