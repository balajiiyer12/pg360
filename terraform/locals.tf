locals {
  machine_types = {
    small  = "e2-small"
    medium = "e2-standard-2"
  }

  active_machine_type = local.machine_types[var.tier_selection]
}