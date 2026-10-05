terraform {
  backend "gcs" {
    bucket = "pg360-terraform-state"
    prefix = "prod"
  }
}
