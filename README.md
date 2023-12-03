# Building Custom Application AMI using Packer

## Prerequisites

- An AWS DEV account.
- An AWS DEMO account.
- Packer installed on your local development machine.
- AWS CLI configured with appropriate credentials for both DEV and DEMO accounts.
- GitHub repository containing your web application and Packer templates.
  
## Packer Template 

1. Store your Packer template within the same repository as your web application.
2. Ensure your Packer template is correctly configured to use Debian 12 as the source image.

## Custom AMI Creation

### AMI Configuration

- Packer will be configured to build private AMIs.
- AMIs will only be accessible in your DEV account and shared with your DEMO account.
- AMIs will be set up to run in your default VPC.

### Application and Dependencies

- Your AMI will include everything needed to run your application and the application binary.

## GitHub Actions Integration

### Status Check Workflow (on Pull Requests)

- When a pull request is raised, a GitHub Actions workflow will be triggered.
- The workflow will run `packer fmt` to ensure the Packer template is correctly formatted. If formatting changes are required, the workflow will fail and prevent the pull request from being merged.
- The workflow will also run `packer validate` to validate the Packer template. If validation fails, the workflow will fail, preventing the pull request from being merged.

### AMI Building Workflow (on Pull Request Merge)

- A new IAM user will be created in your DEV AWS account manually, and security credentials will be configured in your organization's GitHub repository.
- A custom policy will be created and attached to this IAM user to limit its permissions.
- The workflow will be set to trigger when a pull request is merged, not when it is raised.
- Upon merge, the following steps will be performed by the workflow:
  1. Run integration tests.
  2. Build the application artifact (e.g., WAR, JAR, ZIP) on the GitHub Actions runner (not in the AMI) and copy it into the AMI.
  3. Build the AMI with application dependencies and set up the application by copying the application artifacts and configuration files.
  4. The resulting AMI will be shared with the DEMO account.
  5. No AMI will be built if any of the jobs or steps in the workflow fail.
  6. A new Launch Template version with the latest AMI ID for the autoscaling group is created. The autoscaling group is configured to use the latest version of the Launch Template.
  7. Instance refresh is done using AWS CLI.
  8. GitHub Actions workflow will wait for instance refresh to complete before exiting. The status of GitHub Actions workflow will match the status of instance refresh command.