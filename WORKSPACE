load("@bazel_tools//tools/build_defs/repo:http.bzl", "http_archive")

http_archive(
    name = "build_bazel_rules_nodejs",
    urls = ["https://github.com/bazelbuild/rules_nodejs/releases/download/6.5.0/rules_nodejs-6.5.0.tar.gz"],
    strip_prefix = "rules_nodejs-6.5.0",
)

load("@build_bazel_rules_nodejs//:repositories.bzl", "nodejs_register_toolchains")

nodejs_register_toolchains(
    name = "nodejs",
    node_version = "20.11.1",
)
