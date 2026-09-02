# ==========================================
# Jenkins IAM Role
# ==========================================

resource "aws_iam_role" "jenkins" {
  name = "ubargo-jenkins-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"

    Statement = [
      {
        Effect = "Allow"

        Principal = {
          Service = "ec2.amazonaws.com"
        }

        Action = "sts:AssumeRole"
      }
    ]
  })

  tags = {
    Name    = "ubargo-jenkins-role"
    Project = "UberGo"
  }
}

# ==========================================
# Jenkins EC2 Instance Profile
# ==========================================

resource "aws_iam_instance_profile" "jenkins" {
  name = "ubargo-jenkins-instance-profile"
  role = aws_iam_role.jenkins.name
}

# ==========================================
# ECR Permissions
# ==========================================

resource "aws_iam_role_policy" "jenkins_ecr" {
  name = "ubargo-jenkins-ecr-policy"
  role = aws_iam_role.jenkins.id

  policy = jsonencode({
    Version = "2012-10-17"

    Statement = [
      {
        Effect = "Allow"

        Action = [
          "ecr:GetAuthorizationToken"
        ]

        Resource = "*"
      },
      {
        Effect = "Allow"

        Action = [
          "ecr:BatchCheckLayerAvailability",
          "ecr:CompleteLayerUpload",
          "ecr:InitiateLayerUpload",
          "ecr:PutImage",
          "ecr:UploadLayerPart",
          "ecr:BatchGetImage",
          "ecr:DescribeRepositories",
          "ecr:DescribeImages"
        ]

        Resource = "*"
      }
    ]
  })
}



# ==========================================
# UberGo ECR Repository
# ==========================================

resource "aws_ecr_repository" "ubargo" {
  name                 = "ubargo"
  image_tag_mutability = "MUTABLE"

  image_scanning_configuration {
    scan_on_push = true
  }

  tags = {
    Name    = "ubargo-ecr"
    Project = "UberGo"
  }
}


# ==========================================
# EKS Permissions
# ==========================================

resource "aws_iam_role_policy" "jenkins_eks" {
  name = "ubargo-jenkins-eks-policy"
  role = aws_iam_role.jenkins.id

  policy = jsonencode({
    Version = "2012-10-17"

    Statement = [
      {
        Effect = "Allow"

        Action = [
          "eks:DescribeCluster",
          "eks:ListClusters"
        ]

        Resource = "*"
      }
    ]
  })
}