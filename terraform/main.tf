provider "google" {
  project = "pg360-508113"
  region  = local.active_region
}

# 1. Frontend Storage Bucket (Fixed with uniform bucket-level access)
resource "google_storage_bucket" "frontend" {
  name                        = "frontend-bucket-${var.region_selection}-v2"
  location                    = local.active_region
  force_destroy               = true
  uniform_bucket_level_access = true
}

# 2. GKE Cluster Primary
resource "google_container_cluster" "gke_primary" {
  name               = "gke-primary-${var.region_selection}"
  location           = local.active_region
  initial_node_count = 1
  deletion_protection = false # <-- Add this line
  node_config {
    machine_type = local.active_machine_type
  }
}

# 3. GKE Cluster Secondary
resource "google_container_cluster" "gke_secondary" {
  name               = "gke-secondary-${var.region_selection}"
  location           = local.active_region == "us-central1" ? "us-east1" : "europe-west4"
  initial_node_count = 1
  deletion_protection = false # <-- Add this line
  node_config {
    machine_type = local.active_machine_type
  }
}

# 4. Cloud SQL Database
resource "google_sql_database_instance" "postgres" {
  name                = "cloudsql-${var.region_selection}-v2"
  region              = local.active_region
  database_version    = "POSTGRES_15"
  deletion_protection = false # <-- Add this line
  settings { 
    tier = "db-f1-micro" 
  }
}