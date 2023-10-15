packer {
  required_plugins {
    amazon = {

      source  = "github.com/hashicorp/amazon",
      version = "~> 1"
    }
  }
}

variable "aws_region" {
  type    = string
  default = "us-east-1"
}

variable "source_ami" {
  type    = string
  default = "ami-06db4d78cb1d3bbf9"
}

variable "ssh_username" {
  type    = string
  default = "admin"
}

variable "vpc_id" {
  type    = string
  default = "vpc-0d3fb407bc4326b4a"
}

variable "subnet_id" {
  type    = string
  default = "subnet-0f53294986bc969b6"
}


source "amazon-ebs" "veeru-ami" {
  region          = "${var.aws_region}"
  ami_name        = "csye6225_veeru_ami_debian"
  ami_description = "AMI for assignment 5"
  ami_users = [
    "339269296568",
    "042700404980",
  ]

  ami_regions = [
    "${var.aws_region}",
  ]

  aws_polling {
    delay_seconds = 120
    max_attempts  = 50
  }

  instance_type = "t2.micro"
  source_ami    = "${var.source_ami}"
  ssh_username  = "${var.ssh_username}"
  subnet_id     = "${var.subnet_id}"
  vpc_id        = "${var.vpc_id}"
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
    source      = "packer/webapp.zip"
    destination = "/home/admin/webapp.zip"
  }

  provisioner "shell" {
    // environment_vars = [
    //     "DEBIAN_FRONTEND=noninteractive",
    //     "CHECKPOINT_DISABLE=1"
    // ]
    script = "packer/webapp.sh"
  }
}
