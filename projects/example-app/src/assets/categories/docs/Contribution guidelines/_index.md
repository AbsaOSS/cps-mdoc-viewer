---
title: Contribution Guidelines
weight: 10
---

{{% pageinfo %}}
**Note:** Remember to replace this placeholder content with actual project details.

**Guidelines for project page authors:**

- **Clear Contribution Guidelines:** Outline the step-by-step process for contributors. From forking the repository to submitting a pull request, be explicit about the path one should take.
- **Set Expectations:** Clarify the standards for contributions. This could be coding standards, documentation structure, or even the voice and tone of the writing.
- **Provide Templates:** If there are specific formats for documentation or code contributions, provide templates or examples for potential contributors to follow.
- **Link to Resources:** Highlight any tools, platforms, or software necessary for contributors to use. Also, consider linking to resources that might help contributors better understand the documentation or coding standards.
- **List Contact Points:** Specify who to contact for questions or clarifications. This could be community managers, lead developers, or experienced contributors.
- **Feedback Mechanism:** Outline how contributors can get feedback on their submissions or how they can provide feedback on the contribution process itself.
- **Acknowledge Contributions:** Describe how the project acknowledges or rewards contributions, be it through public recognition, inclusion in a contributor list, or any other means.
  {{% /pageinfo %}}

## Contribute to [ProjectName] Documentation

We're excited that you're interested in contributing to the [ProjectName] documentation! Below, you'll find all the guidelines and steps you need to make meaningful contributions.

## Clear Contribution Guidelines

### Step-by-Step Process

1. **Fork the Repository:** Start by forking the [ProjectName documentation repository](#).
2. **Clone Your Fork:** Once forked, clone the repository to your local system to make changes.
3. **Make Your Changes:** Edit the relevant documentation files or add new ones as necessary.
4. **Commit and Push:** After making changes, commit them with a meaningful commit message and then push to your fork.
5. **Submit a Pull Request:** Finally, visit the original [ProjectName documentation repository](#) and submit a pull request.

## Previewing your changes locally

If you want to run your own local Hugo server to preview your changes as you work:

1. Follow the instructions in [Getting started](/docs/getting-started) to install Hugo and any other tools you need. You'll need at least **Hugo version 0.45** (we recommend using the most recent available version), and it must be the **extended** version, which supports SCSS.
2. Fork the [Living Doc website example repo](https://github.com/absa-group/living-doc-website-example) repo into your own project, then create a local copy using `git clone`. Don’t forget to use `--recurse-submodules` or you won’t pull down some of the code you need to generate a working site.

   ```
   git clone --recurse-submodules --depth 1 https://github.com/absa-group/living-doc-website-example.git
   ```

3. Run `hugo server` in the site root directory. By default your site will be available at http://localhost:1313/. Now that you're serving your site locally, Hugo will watch for changes to the content and automatically refresh your site.
4. Continue with the usual GitHub workflow to edit files, commit them, push the
   changes up to your fork, and create a pull request.

## Creating an issue

If you've found a problem in the docs, but you're not sure how to fix it yourself, please create an issue in the [Living Doc website example repo](https://github.com/absa-group/living-doc-website-example/issues). You can also create an issue about a specific page by clicking the **Create Issue** button in the top right hand corner of the page.

## Useful resources

- [Docsy user guide](https://www.docsy.dev/docs/): All about Docsy, including how it manages navigation, look and feel, and multi-language support.
- [Hugo documentation](https://gohugo.io/documentation/): Comprehensive reference for Hugo.
- [Github Hello World!](https://guides.github.com/activities/hello-world/): A basic introduction to GitHub concepts and workflow.

## Set Expectations

All contributions should adhere to the following standards:

- **Coding Standards:** If you're adding code snippets or examples, make sure they are clear, concise, and follow our [coding guidelines](#).
- **Documentation Structure:** Keep the structure consistent. If you're introducing a new section, ensure it fits seamlessly with the existing documentation.
- **Voice and Tone:** Maintain a professional, yet approachable voice in all documentation. Avoid slang and ensure clarity.

## Provide Templates

When making contributions, you can use our provided templates to maintain consistency:

- **Documentation Template:** For creating new documentation pages, use our [documentation template](#).
- **Code Example Template:** For adding code examples, refer to our [code example template](#).

## Link to Resources

For those new to contributing or in need of a refresher, here are some vital resources:

- **Git & GitHub Tutorial:** If you're unfamiliar with Git or GitHub, this [tutorial](#) will guide you.
- **Markdown Guide:** Our documentation uses Markdown. Brush up on your skills with this [guide](#).

## List Contact Points

Should you have questions or need further clarifications:

- **Community Manager:** [Jane Doe](mailto:jane.doe@example.com)
- **Lead Developer:** [John Smith](mailto:john.smith@example.com)
- **General Queries:** Join our [community forum](#).

## Feedback Mechanism

We value feedback. If you have suggestions to improve the documentation or the contribution process:

- **Provide Feedback:** Use our feedback [form](#) or raise an issue on our GitHub repository.

## Acknowledge Contributions

Every contribution, no matter how small, plays a vital role in improving our documentation. We acknowledge all contributors in our [Contributors' List](#). Furthermore, significant contributors might be highlighted in our monthly community newsletters.
