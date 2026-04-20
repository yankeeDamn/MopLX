export interface Resource {
  slug: string;
  title: string;
  description: string;
  category: string;
  type: "free" | "paid";
  image: string;
  content: string;
  publishedAt: string;
  readTime: string;
  price?: number;
}

export const resources: Resource[] = [
  {
    slug: "kubernetes-fundamentals",
    title: "Kubernetes Fundamentals: From Zero to Hero",
    description:
      "Learn the core concepts of Kubernetes including pods, services, deployments, and more. Perfect for beginners starting their container orchestration journey.",
    category: "Kubernetes",
    type: "free",
    image: "/images/kubernetes.svg",
    content: `
## Introduction to Kubernetes

Kubernetes (K8s) is an open-source container orchestration platform that automates the deployment, scaling, and management of containerized applications.

### What You'll Learn

- **Pods**: The smallest deployable units in Kubernetes
- **Services**: How to expose your applications
- **Deployments**: Managing application updates and rollbacks
- **ConfigMaps & Secrets**: Managing configuration
- **Namespaces**: Organizing cluster resources

### Prerequisites

- Basic understanding of containers (Docker)
- Command-line familiarity
- A computer with at least 8GB RAM

### Getting Started

First, install kubectl and set up a local cluster using minikube or kind:

\`\`\`bash
# Install minikube
curl -LO https://storage.googleapis.com/minikube/releases/latest/minikube-linux-amd64
sudo install minikube-linux-amd64 /usr/local/bin/minikube

# Start your cluster
minikube start
\`\`\`

### Your First Pod

Create a simple pod definition:

\`\`\`yaml
apiVersion: v1
kind: Pod
metadata:
  name: my-first-pod
spec:
  containers:
  - name: nginx
    image: nginx:latest
    ports:
    - containerPort: 80
\`\`\`

This is just the beginning of your Kubernetes journey. Continue exploring services, deployments, and more advanced topics.
    `,
    publishedAt: "2024-03-15",
    readTime: "15 min read",
  },
  {
    slug: "ci-cd-pipeline-guide",
    title: "Building Production-Ready CI/CD Pipelines",
    description:
      "A comprehensive guide to building robust CI/CD pipelines using GitHub Actions, Jenkins, and GitLab CI. Includes real-world examples and best practices.",
    category: "CI/CD",
    type: "free",
    image: "/images/cicd.svg",
    content: `
## CI/CD Pipeline Best Practices

Continuous Integration and Continuous Deployment (CI/CD) is the backbone of modern software delivery.

### Key Principles

1. **Automate Everything**: From builds to tests to deployments
2. **Fail Fast**: Catch issues early in the pipeline
3. **Keep It Simple**: Start simple and iterate
4. **Version Control Everything**: Including your pipeline configs

### GitHub Actions Example

\`\`\`yaml
name: CI/CD Pipeline
on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  build-and-test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
      - run: npm ci
      - run: npm test
      - run: npm run build
\`\`\`

### Pipeline Stages

- **Build**: Compile and package your application
- **Test**: Run unit, integration, and e2e tests
- **Security Scan**: Check for vulnerabilities
- **Deploy to Staging**: Validate in a production-like environment
- **Deploy to Production**: Ship to users
    `,
    publishedAt: "2024-04-01",
    readTime: "12 min read",
  },
  {
    slug: "terraform-infrastructure-as-code",
    title: "Terraform: Infrastructure as Code Masterclass",
    description:
      "Master Terraform from basics to advanced patterns. Learn how to manage cloud infrastructure declaratively across AWS, Azure, and GCP.",
    category: "IaC",
    type: "paid",
    image: "/images/terraform.svg",
    content: `
## Terraform Masterclass

This premium course covers everything you need to know about managing infrastructure with Terraform.

### Module 1: Foundations
- HCL Language Basics
- Providers and Resources
- State Management

### Module 2: Advanced Patterns
- Modules and Composition
- Workspaces
- Remote State with Backends

### Module 3: Real-World Projects
- Multi-environment setup (dev/staging/prod)
- AWS VPC with public/private subnets
- Kubernetes cluster provisioning

### Module 4: Best Practices
- Code organization
- Testing infrastructure code
- CI/CD for Terraform
    `,
    publishedAt: "2024-02-20",
    readTime: "4 hours",
    price: 49,
  },
  {
    slug: "docker-containerization-deep-dive",
    title: "Docker Containerization Deep Dive",
    description:
      "Go beyond the basics of Docker. Learn multi-stage builds, networking, security hardening, and production deployment strategies.",
    category: "Containers",
    type: "paid",
    image: "/images/docker.svg",
    content: `
## Docker Deep Dive

Take your Docker skills to the next level with this comprehensive deep-dive course.

### What's Covered

- **Multi-stage Builds**: Optimize your images for production
- **Docker Networking**: Bridge, overlay, and macvlan networks
- **Security**: Rootless containers, scanning, and best practices
- **Docker Compose**: Multi-service applications
- **Production Patterns**: Health checks, resource limits, logging

### Multi-stage Build Example

\`\`\`dockerfile
# Build stage
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

# Production stage
FROM node:20-alpine
WORKDIR /app
COPY --from=builder /app/node_modules ./node_modules
COPY . .
EXPOSE 3000
CMD ["node", "server.js"]
\`\`\`
    `,
    publishedAt: "2024-03-10",
    readTime: "3 hours",
    price: 39,
  },
  {
    slug: "monitoring-observability-guide",
    title: "Complete Monitoring & Observability Guide",
    description:
      "Learn how to implement comprehensive monitoring using Prometheus, Grafana, and the ELK stack. Understand the three pillars of observability.",
    category: "Observability",
    type: "free",
    image: "/images/monitoring.svg",
    content: `
## Monitoring & Observability

Understanding the three pillars of observability is crucial for running reliable systems.

### The Three Pillars

1. **Metrics**: Numerical data points over time (Prometheus, DataDog)
2. **Logs**: Discrete event records (ELK Stack, Loki)
3. **Traces**: Request flow across services (Jaeger, Zipkin)

### Prometheus + Grafana Setup

\`\`\`yaml
# docker-compose.yml
services:
  prometheus:
    image: prom/prometheus
    ports:
      - "9090:9090"
    volumes:
      - ./prometheus.yml:/etc/prometheus/prometheus.yml

  grafana:
    image: grafana/grafana
    ports:
      - "3000:3000"
    depends_on:
      - prometheus
\`\`\`

### Key Metrics to Monitor

- **RED Method**: Rate, Errors, Duration
- **USE Method**: Utilization, Saturation, Errors
- **Four Golden Signals**: Latency, Traffic, Errors, Saturation
    `,
    publishedAt: "2024-04-10",
    readTime: "10 min read",
  },
  {
    slug: "aws-devops-professional",
    title: "AWS DevOps Professional Certification Prep",
    description:
      "Prepare for the AWS DevOps Professional certification with hands-on labs, practice exams, and comprehensive study materials covering all exam domains.",
    category: "Cloud",
    type: "paid",
    image: "/images/aws.svg",
    content: `
## AWS DevOps Professional Certification

A complete preparation guide for the AWS Certified DevOps Engineer - Professional exam.

### Exam Domains

1. **SDLC Automation** (22%)
2. **Configuration Management & IaC** (17%)
3. **Monitoring & Logging** (15%)
4. **Policies & Standards Automation** (10%)
5. **Incident & Event Response** (18%)
6. **High Availability, Fault Tolerance & DR** (18%)

### Key Services to Master

- CodePipeline, CodeBuild, CodeDeploy
- CloudFormation & CDK
- CloudWatch, X-Ray, CloudTrail
- ECS, EKS, Lambda
- Auto Scaling, Route 53, ELB

### Practice Labs Included

- Blue/Green deployments with CodeDeploy
- Multi-region DR setup
- Custom CloudWatch metrics and alarms
- Infrastructure automation with CloudFormation
    `,
    publishedAt: "2024-01-15",
    readTime: "8 hours",
    price: 79,
  },
];

export function getResourceBySlug(slug: string): Resource | undefined {
  return resources.find((r) => r.slug === slug);
}

export function getFreeResources(): Resource[] {
  return resources.filter((r) => r.type === "free");
}

export function getPaidResources(): Resource[] {
  return resources.filter((r) => r.type === "paid");
}
