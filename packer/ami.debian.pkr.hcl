packer {
  required_plugins {
    amazon = {
      source  = "github.com/hashicorp/amazon",
      version = "~> 1"
    }
  }
}

source "amazon-ebs" "veeru-ami" {
  region          = "${var.aws_region}"
  ami_name        = "csye6225_${formatdate("YYYY_MM_DD_hh_mm_ss", timestamp())}"
  ami_description = "AMI for assignment 5"
  ami_users       = var.ami_users

  ami_regions = var.ami_regions

  aws_polling {
    delay_seconds = 120
    max_attempts  = 50
  }

  instance_type = "t2.micro"
  source_ami    = "${var.source_ami}"
  ssh_username  = "${var.ssh_username}"
  subnet_id     = "${var.subnet_id}"
  profile       = "dev"

  launch_block_device_mappings {
    device_name           = "/dev/xvda"
    delete_on_termination = true
    volume_size           = 8
    volume_type           = "gp2"
  }
}

build {
  sources = [
    "source.amazon-ebs.veeru-ami"
  ]

  provisioner "file" {
    source      = "${var.artifact}"
    destination = "/home/admin/webapp.zip"
  }

  provisioner "file" {
    source      = "node.service"
    destination = "/home/admin/node.service"
  }

  provisioner "shell" {
    script = "packer/webapp.sh"
    environment_vars = [
      "DEBIAN_FRONTEND=noninteractive",
      "CHECKPOINT_DISABLE=1",
    ]
  }
}
