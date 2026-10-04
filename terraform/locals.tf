locals {
  regions = {
    us = "us-central1"
    eu = "europe-west1"
    ap = "asia-east1"
  }

  machine_types = {
    small  = "e2-medium"
    medium = "e2-standard-2"
  }

  active_region       = local.regions[var.region_selection]
  active_machine_type = local.machine_types[var.tier_selection]
}