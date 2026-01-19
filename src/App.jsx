import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  Divider,
  Grid,
  IconButton,
  Link,
  Stack,
  Typography
} from "@mui/material";
import {
  ArrowOutward,
  GitHub,
  LinkedIn,
  MailOutline
} from "@mui/icons-material";

const projects = [
  {
    title: "Atlas Design System",
    description:
      "A flexible UI kit and token pipeline that keeps products visually consistent across teams.",
    tags: ["React", "Storybook", "Design Tokens"],
    link: "#"
  },
  {
    title: "Signal Lab",
    description:
      "Realtime analytics dashboard that surfaces the three metrics that matter most each week.",
    tags: ["Data Viz", "Streaming", "Leadership"],
    link: "#"
  },
  {
    title: "Nimbus Studio",
    description:
      "A collaborative planning space that pairs strategic goals with weekly execution cycles.",
    tags: ["Product", "UX", "B2B"],
    link: "#"
  }
];

const highlights = [
  {
    label: "8+",
    caption: "years building products"
  },
  {
    label: "15",
    caption: "shipped launches"
  },
  {
    label: "3",
    caption: "teams led"
  }
];

export default function App() {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        position: "relative",
        overflow: "hidden",
        background:
          "radial-gradient(circle at 10% 20%, #fef7e7 0%, #f7f4ef 40%, #eef2f7 100%)",
        color: "text.primary",
        "@keyframes float": {
          "0%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-12px)" },
          "100%": { transform: "translateY(0px)" }
        }
      }}
    >
      <Box
        sx={{
          position: "absolute",
          top: "-120px",
          right: "-80px",
          width: "320px",
          height: "320px",
          borderRadius: "50%",
          background: "radial-gradient(circle, #ffb38a 0%, #ffeadf 60%)",
          opacity: 0.6,
          filter: "blur(2px)",
          animation: "float 10s ease-in-out infinite"
        }}
      />
      <Box
        sx={{
          position: "absolute",
          bottom: "-160px",
          left: "-100px",
          width: "380px",
          height: "380px",
          borderRadius: "50%",
          background: "radial-gradient(circle, #8ecae6 0%, #e0f1ff 65%)",
          opacity: 0.55,
          animation: "float 12s ease-in-out infinite"
        }}
      />
      <Container sx={{ py: { xs: 7, md: 12 }, position: "relative" }}>
        <Stack spacing={{ xs: 8, md: 10 }}>
          <Stack spacing={4} alignItems="flex-start">
            <Chip
              label="Product + Frontend Engineer"
              color="secondary"
              sx={{
                fontWeight: 600,
                color: "#fff",
                px: 1.5,
                py: 0.5
              }}
            />
            <Typography variant="h1" sx={{ fontSize: { xs: "2.6rem", md: "4.3rem" } }}>
              Sandeep JR builds crisp, human-first digital products.
            </Typography>
            <Typography
              variant="h5"
              sx={{ maxWidth: 640, color: "text.secondary", fontSize: { xs: "1.1rem", md: "1.35rem" } }}
            >
              I craft product experiences that move fast without feeling rushed—blending engineering
              rigor, bold visual systems, and calm delivery.
            </Typography>
            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
              <Button variant="contained" size="large" endIcon={<ArrowOutward />} href="#contact">
                Let&apos;s collaborate
              </Button>
              <Button variant="outlined" size="large" href="#projects">
                View projects
              </Button>
            </Stack>
            <Stack direction="row" spacing={4} flexWrap="wrap">
              {highlights.map((item) => (
                <Stack key={item.label} spacing={0.5}>
                  <Typography variant="h4" sx={{ fontWeight: 700 }}>
                    {item.label}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {item.caption}
                  </Typography>
                </Stack>
              ))}
            </Stack>
          </Stack>

          <Box id="projects">
            <Stack spacing={2} mb={4}>
              <Typography variant="h2" sx={{ fontSize: { xs: "2rem", md: "2.8rem" } }}>
                Selected projects
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 620 }}>
                A few recent engagements that balance strategy, design, and rapid delivery. Swap
                these with your real work as you iterate.
              </Typography>
            </Stack>
            <Grid container spacing={3}>
              {projects.map((project) => (
                <Grid item xs={12} md={4} key={project.title}>
                  <Card
                    sx={{
                      height: "100%",
                      background: "rgba(255, 255, 255, 0.9)",
                      backdropFilter: "blur(8px)",
                      border: "1px solid rgba(15, 76, 129, 0.08)",
                      boxShadow: "0 18px 40px rgba(15, 76, 129, 0.08)",
                      transition: "transform 0.3s ease, box-shadow 0.3s ease",
                      "&:hover": {
                        transform: "translateY(-6px)",
                        boxShadow: "0 24px 50px rgba(15, 76, 129, 0.15)"
                      }
                    }}
                  >
                    <CardContent>
                      <Stack spacing={2}>
                        <Typography variant="h5" sx={{ fontWeight: 600 }}>
                          {project.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {project.description}
                        </Typography>
                        <Stack direction="row" spacing={1} flexWrap="wrap">
                          {project.tags.map((tag) => (
                            <Chip key={tag} label={tag} size="small" />
                          ))}
                        </Stack>
                        <Button
                          size="small"
                          endIcon={<ArrowOutward />}
                          href={project.link}
                          sx={{ alignSelf: "flex-start" }}
                        >
                          View case study
                        </Button>
                      </Stack>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>

          <Grid container spacing={4} alignItems="stretch">
            <Grid item xs={12} md={7}>
              <Stack spacing={2}>
                <Typography variant="h2" sx={{ fontSize: { xs: "2rem", md: "2.6rem" } }}>
                  About & focus
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  I specialize in designing systems that let teams move from rough ideas to crisp
                  releases. Expect tight feedback loops, strong communication, and a bias for high
                  craft.
                </Typography>
                <Stack direction="row" spacing={1} flexWrap="wrap">
                  {["Product strategy", "Frontend architecture", "Design systems", "Team mentorship"].map(
                    (item) => (
                      <Chip key={item} label={item} variant="outlined" />
                    )
                  )}
                </Stack>
              </Stack>
            </Grid>
            <Grid item xs={12} md={5}>
              <Card
                sx={{
                  height: "100%",
                  background: "#0f4c81",
                  color: "#fff",
                  display: "flex",
                  alignItems: "center"
                }}
              >
                <CardContent>
                  <Stack spacing={2}>
                    <Typography variant="h5" sx={{ fontWeight: 600 }}>
                      Current availability
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.8 }}>
                      Open to select consulting projects and full-time product roles starting in
                      2024.
                    </Typography>
                    <Button
                      variant="contained"
                      color="secondary"
                      href="#contact"
                      sx={{ alignSelf: "flex-start", color: "#fff" }}
                    >
                      Book a call
                    </Button>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          <Box id="contact">
            <Stack spacing={2}>
              <Typography variant="h2" sx={{ fontSize: { xs: "2rem", md: "2.8rem" } }}>
                Let&apos;s build something remarkable
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 620 }}>
                Share your idea, timeline, or hiring needs. I&apos;ll respond within two business days.
              </Typography>
              <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                <Button variant="contained" size="large" href="mailto:hello@example.com">
                  hello@example.com
                </Button>
                <Button variant="outlined" size="large" href="#">
                  Download resume
                </Button>
              </Stack>
            </Stack>
          </Box>

          <Divider />

          <Stack direction={{ xs: "column", md: "row" }} spacing={2} justifyContent="space-between">
            <Typography variant="body2" color="text.secondary">
              © 2024 Sandeep JR. Crafted with React + MUI.
            </Typography>
            <Stack direction="row" spacing={1}>
              <IconButton href="https://github.com/" aria-label="GitHub" color="primary">
                <GitHub />
              </IconButton>
              <IconButton href="https://linkedin.com/" aria-label="LinkedIn" color="primary">
                <LinkedIn />
              </IconButton>
              <IconButton href="mailto:hello@example.com" aria-label="Email" color="primary">
                <MailOutline />
              </IconButton>
            </Stack>
          </Stack>
          <Typography variant="caption" color="text.secondary">
            Replace the placeholders with your real contact info, projects, and links.
          </Typography>
        </Stack>
      </Container>
    </Box>
  );
}
