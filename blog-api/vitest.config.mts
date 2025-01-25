import { configDefaults, defineConfig } from 'vitest/config'

export default defineConfig({
    test: {
        // poolOptions: {
        //     threads: {
        //         singleThread: true,
        //     },
        // },
        exclude: [...configDefaults.exclude, 'packages/template/*'],
    },
})
