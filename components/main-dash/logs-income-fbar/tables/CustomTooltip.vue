<template>
    <div class="relative inline-block w-full" @mouseenter="startTimer" @mouseleave="hideTooltip">
        <div ref="trigger" class="w-full">
            <slot></slot>
        </div>
        <transition enter-active-class="transition duration-200 ease-out" enter-from-class="translate-y-1 opacity-0"
            enter-to-class="translate-y-0 opacity-100" leave-active-class="transition duration-150 ease-in"
            leave-from-class="translate-y-0 opacity-100" leave-to-class="translate-y-1 opacity-0">
            <div v-if="show" ref="tooltip" class="tooltip-container" @mouseenter="keepTooltip"
                @mouseleave="hideTooltip">
                <div class="tooltip-content">
                    <slot name="content"></slot>
                </div>
            </div>
        </transition>
    </div>
</template>

<script>
import { createPopper } from '@popperjs/core'

export default {
    name: 'CustomTooltip',
    props: {
        delay: {
            type: Number,
            default: 500
        }
    },
    data() {
        return {
            show: false,
            timer: null,
            popperInstance: null
        }
    },
    methods: {
        startTimer() {
            this.timer = setTimeout(() => {
                this.showTooltip()
            }, this.delay)
        },
        showTooltip() {
            this.show = true
            this.$nextTick(() => {
                this.createPopper()
            })
        },
        hideTooltip() {
            clearTimeout(this.timer)
            this.show = false
            if (this.popperInstance) {
                this.popperInstance.destroy()
                this.popperInstance = null
            }
        },
        keepTooltip() {
            clearTimeout(this.timer)
            this.show = true
        },
        createPopper() {
            if (!this.popperInstance && this.$refs.tooltip && this.$refs.trigger) {
                this.popperInstance = createPopper(this.$refs.trigger, this.$refs.tooltip, {
                    placement: 'right',
                    modifiers: [
                        {
                            name: 'offset',
                            options: {
                                offset: [0, 8]
                            }
                        },
                        {
                            name: 'preventOverflow',
                            options: {
                                padding: 8
                            }
                        }
                    ]
                })
            }
        }
    },
    beforeDestroy() {
        if (this.popperInstance) {
            this.popperInstance.destroy()
        }
        clearTimeout(this.timer)
    }
}
</script>

<style scoped>
.tooltip-container {
    z-index: 50;
    position: absolute;
    background: white;
    border-radius: 0.375rem;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
    max-width: 300px;
}

.tooltip-content {
    padding: 0.5rem;
    font-size: 0.875rem;
    line-height: 1.25rem;
    white-space: pre-wrap;
    word-wrap: break-word;
}
</style>