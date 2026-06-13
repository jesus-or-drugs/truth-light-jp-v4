<template>
    <!-- md未満: メニューボタン -->
    <button id="mobileButton"
			type="button"
			class="inline md:hidden menu-button w-auto h-4"
			aria-controls="mobileMenu" :aria-expanded="isMobileMenuOpen" aria-label="モバイルメニューを開く"
			@click="isMobileMenuOpen = !isMobileMenuOpen"
		>
        <img src="/ui/menu_hamburger.png" alt="" class="w-auto h-4" />
    </button>

    <nav
			id="mobileMenu"
			class="text-sm fixed inset-y-0 left-0 h-screen z-50 w-[85vw] max-w-sm bg-[#EAEFEF] text-[#25343F] border-r border-[#BFC9D1]/80 p-4
			transition-transform duration-300 ease-in-out
			md:hidden"
			:class="{ 'translate-x-0 pointer-events-auto': isMobileMenuOpen, '-translate-x-full pointer-events-none': !isMobileMenuOpen }"
			:aria-hidden="!isMobileMenuOpen"
			aria-label="モバイルメニュー"
		>

			<div class="flex flex-col">
				<div class="flex flex-row items-center justify-between">
					<p class="custom-font-bold">メニュー</p>

					<button
						id="mobileCloseButton"
						type="button"
						class="rounded-lg border border-white/10 px-3 py-2 hover:bg-white/10"
						aria-label="モバイルメニューを閉じる"
						@click="isMobileMenuOpen = false"
					>
						<img src="/ui/close_black.png" alt="閉じる" class="w-4 h-auto" />
					</button>
				</div>

				<!-- メインメニュー -->
				<ul class="flex flex-col justify-start gap-2 list-none">
					<li v-for="n in navItems" :key="n.key" class="flex items-center relative group">
						<!-- 単体リンク -->
						<NuxtLink
						v-if="n.type === 'link'"
						:key="n.key"
						:to="n.item.to"
						class="py-2 hover:text-[#FF9B51]"
						@click.prevent="navigateFromMenu(n.item.to)"
						>
						{{ n.item.title }}
						</NuxtLink>

						<!-- ドロップダウン -->
						<template v-else>
						<details name="nestedMenu" class="flex flex-col gap-1">

							<summary><span>{{ n.title }}</span></summary>

							<ul class="flex flex-col gap-2 pl-4">
								<li v-for="c in n.children" class="block">
									<NuxtLink
										:key="c.key"
										:to="c.item.to"
										class="no-underline"
										@click.prevent="navigateFromMenu(c.item.to)"
									>
										{{ c.item.title }}
									</NuxtLink>
								</li>
							</ul>
						</details>					
						</template>
					</li>
				</ul>
      </div>
    </nav>

</template>

<script setup lang="ts">
import { computed, ref } from "vue"

const isMobileMenuOpen = ref(false)
const closeMobileMenu = () => {
	isMobileMenuOpen.value = false
}
const navigateFromMenu = async (to: string) => {
	await navigateTo(to)
	closeMobileMenu()
}

const appConfig = useAppConfig()

type NavLeaf = { title: string; type: string; to: string }
type NavNode =
    | { key: string; type: "link"; item: NavLeaf }
    | { key: string; type: "menu"; title: string; children: { key: string; item: NavLeaf }[] }

const rawNav = computed<Record<string, any>>(
    () => appConfig.truthlight?.header?.nav ?? {}
)

const navItems = computed<NavNode[]>(() => {
    return Object.entries(rawNav.value).map(
        ([key, value]: any) => {
            // 単一メニューはそのまま表示
            if (value.type === "link") {
                return { key: key, type: value.type, item: value as NavLeaf }
            }

            // 複数メニューはプルダウン化
            if (value.type === "menu") {
                const children = Object.entries(value)
                    .filter(([k, v]: any) => v.type === "link")
                    .map(([childKey, childVal]: any) => ({ key: childKey, item: childVal }))

                return { key, type: "menu", title: value.title, children }
            }
            // それ以外
            return { key, type: "link", item: { title: String(key), type: "link", to: "/" } }
        }
    )
})


</script>
