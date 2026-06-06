export interface FocusArea {
  title: string;
  blurb: string;
}

export interface SkillGroup {
  label: string;
  items: string[];
}

export const engineering = {
  intro:
    "Engineering excites me because it combines logic, creativity, and service. At its best, engineering is not just about making systems work; it is about making complexity understandable, reliable, and useful for people. My areas of depth include backend platforms, financial systems, fraud systems, distributed architecture, observability, data-intensive applications, and cloud-native infrastructure. I'm especially interested in the future of agentic AI, workflow orchestration, service mesh, and platform engineering — not as isolated technologies, but as building blocks for products and organizations that can move with greater clarity, speed, and trust.",
  focusAreas: [
    { title: 'Platform Engineering', blurb: 'Designing reusable systems, services, and capabilities that help teams build faster without sacrificing reliability or clarity.' },
    { title: 'Distributed Systems', blurb: 'Building backend architectures that handle scale, failure, data movement, observability, and long-running business workflows.' },
    { title: 'FinTech & Fraud Systems', blurb: 'Creating platforms for money movement, fraud prevention, chargebacks, subscriptions, risk visibility, and financial operations.' },
    { title: 'Cloud-Native Infrastructure', blurb: 'Exploring Kubernetes, Docker, Envoy, Istio, ArgoCD, Helm, GitOps, Prometheus, Grafana, and production-grade deployment patterns.' },
    { title: 'Agentic AI Infrastructure', blurb: 'Studying how agents, tools, workflows, memory, evaluation, and orchestration can become reliable production systems.' },
  ] satisfies FocusArea[],
  skills: [
    { label: 'Languages', items: ['Java', 'Go', 'Python', 'JavaScript', 'TypeScript', 'SQL', 'Rust'] },
    { label: 'Backend', items: ['Spring Boot', 'gRPC', 'REST', 'Kafka', 'Kafka Streams', 'Kafka Connect', 'Temporal', 'Redis', 'Feign', 'SFTP'] },
    { label: 'Databases', items: ['MySQL', 'MongoDB', 'ClickHouse', 'Vertica', 'Neo4j', 'PostgreSQL', 'Cassandra', 'ScyllaDB', 'Elasticsearch'] },
    { label: 'Infrastructure', items: ['Docker', 'Kubernetes', 'Helm', 'ArgoCD', 'Nginx Ingress', 'Envoy', 'Istio', 'Bazel', 'GitHub Actions'] },
    { label: 'Observability', items: ['Prometheus', 'Micrometer', 'Grafana', 'Splunk', 'Distributed tracing', 'Metrics dashboards'] },
    { label: 'Frontend / Data Viz', items: ['React', 'MUI', 'D3', 'Nivo'] },
    { label: 'AI / Agents', items: ['LLM applications', 'Agent workflows', 'Tool use', 'Evaluation', 'Retrieval', 'Orchestration', 'AI infrastructure'] },
    { label: 'Practices', items: ['Platform design', 'System architecture', 'Technical leadership', 'Mentorship', 'Reliability engineering', 'Product thinking'] },
  ] satisfies SkillGroup[],
} as const;
