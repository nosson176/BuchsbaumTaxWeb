<template>
    <div class="relative inline-block w-full">
        <div ref="trigger" class="w-full">
            <slot></slot>
        </div>
        <transition enter-active-class="transition duration-200 ease-out" enter-from-class="translate-y-1 opacity-0"
            enter-to-class="translate-y-0 opacity-100" leave-active-class="transition duration-150 ease-in"
            leave-from-class="translate-y-0 opacity-100" leave-to-class="translate-y-1 opacity-0">
            <div v-show="show" class="tooltip-wrapper">
                <!-- Invisible bridge to maintain hover state -->
                <div class="tooltip-bridge"></div>
                <div ref="tooltip" class="tooltip-container">
                    <div class="tooltip-content">
                        <slot name="content"></slot>
                    </div>
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
            if (!this.show) {
                this.timer = setTimeout(() => {
                    this.show = true
                    this.$nextTick(() => {
                        this.createPopper()
                    })
                }, this.delay)
            }
        },
        hideTooltip() {
            clearTimeout(this.timer)
            this.timer = setTimeout(() => {
                this.show = false
                if (this.popperInstance) {
                    this.popperInstance.destroy()
                    this.popperInstance = null
                }
            }, 100) // Small delay to prevent flickering
        },
        createPopper() {
            if (!this.popperInstance && this.$refs.tooltip && this.$refs.trigger) {
                this.popperInstance = createPopper(this.$refs.trigger, this.$refs.tooltip, {
                    placement: 'right-start',
                    modifiers: [
                        {
                            name: 'offset',
                            options: {
                                offset: [0, 0] // Reduced offset to minimize gap
                            }
                        },
                        {
                            name: 'preventOverflow',
                            options: {
                                padding: 8,
                                boundariesElement: 'viewport'
                            }
                        }
                    ]
                })
            }
        }
    },
    mounted() {
        // Add event listeners to the parent container
        const container = this.$el
        container.addEventListener('mouseenter', this.startTimer)
        container.addEventListener('mouseleave', this.hideTooltip)
    },
    beforeDestroy() {
        // Clean up
        const container = this.$el
        container.removeEventListener('mouseenter', this.startTimer)
        container.removeEventListener('mouseleave', this.hideTooltip)

        if (this.popperInstance) {
            this.popperInstance.destroy()
        }
        clearTimeout(this.timer)
    }
}
</script>

<style scoped>
.v-popper--theme-info-tooltip .v-popper__arrow-outer {
    @apply border-blue-100;
}

.tooltip-wrapper {
    position: absolute;
    z-index: 50;
    pointer-events: none;
}

.tooltip-bridge {
    position: absolute;
    top: 0;
    left: -8px;
    width: 100%;
    height: 100%;
    pointer-events: auto;
}

.tooltip-container {
    pointer-events: auto;
    background-color: rgb(219 234 254);
    border-radius: 0.25rem;
    padding: 0.5rem;
    max-width: 600px;
}

.tooltip-content {
    font-size: 0.875rem;
    line-height: 1.25rem;
    white-space: pre-wrap;
    word-wrap: break-word;
    color: rgb(17 24 39);
}
</style>