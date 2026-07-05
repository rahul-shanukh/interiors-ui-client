
terraform {
  required_providers {
    cloudflare = {
      source  = "cloudflare/cloudflare"
      version = "~> 5.0"
    } 
  }
}

provider "cloudflare" {
  api_token = var.cloudflare_api_token
}

resource "cloudflare_r2_bucket" "assets_bucket" {
  account_id = var.cloudflare_account_id
  name       = var.bucket_name
  location   = "apac"
}

resource "cloudflare_r2_bucket_cors" "example" {
  account_id = var.cloudflare_account_id
  bucket_name = cloudflare_r2_bucket.assets_bucket.name

  rules = [{
    allowed = {
      methods = ["GET"]
      origins = ["http://localhost:5173"]
      headers = ["*"]
    }
    max_age_seconds = 3600
  }]
}








