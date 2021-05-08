<template>
    <nav class="navbar navbar-expand-lg bg-dark">
        <div class="container-fluid">
            <span class="navbar-brand mb-0 h1 text-primary">deploy-it</span>

            <div class="d-flex">
                <button class="btn btn-link text-primary pull-right" @click="$emit('openSettings')">
                    <i class="bi-gear-fill" style="font-size: 1.3rem;"></i>
                </button>
            </div>
        </div>
    </nav>
</template>

<script>
export default {
    name: 'Navbar',
}
</script>
