<script>
  import Grid from "$lib/components/home/Grid.svelte";
  import Statusbar from "$lib/components/Statusbar.svelte";
  import Features from "$lib/components/home/Features.svelte";
  import Header from "$lib/components/home/Header.svelte";
  import OrganisationLdJson from "$lib/seo/OrganisationLdJson.svelte";
  import { page } from "$app/stores";
</script>

<svelte:head>
  <title>VerusHub</title>
  <meta property="og:site_name" content="VerusHub"/>
  <meta name="description"
        content="A fully private and secure blockchain based messenger that completely runs on blockchain. offering anonymous and secure messaging.">
  <meta property="og:title" content="VerusHub"/>
  <meta property="og:description"
        content="A fully private and secure blockchain based messenger that completely runs on blockchain. offering anonymous and secure messaging."/>
  <meta property="og:image" content="https://user-images.githubusercontent.com/36674091/230983427-7614033e-db05-4ea8-aa1e-8d4e3ca57144.png">
  <meta property="og:url" content="https://verus.io"/>
  <meta property="og:locale" content="en"/>
  <link rel="canonical" href="{$page.url.href}" />
</svelte:head>

<!--SEO-->
<OrganisationLdJson />

<!--CONTENT-->
<Header />
<Features />
<Grid />
<Statusbar />
<!--<LatestPosts posts={posts.data}/>-->