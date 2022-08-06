<template>
    <div class="schedule">
        <div class="items">
            <div class="item" :class="{ active: schedule.interval === item.interval }" v-for="item in items" :key="item" @click="onClick(item)">
                <span>{{ item.title }}</span>
            </div>
        </div>
        <div class="tip">CTRL + CLICK = APPLY THE TIME FOR ALL BACKUPS</div>
    </div>
</template>
<script>
import { useBackupsStore } from 'front/store/backups';

export default {
    props: {
        schedule: Object,
        added: Number
    },
    data() {
        return {
            items: [
                {
                    title: 'OFF',
                    interval: 0
                },
                {
                    title: '5 MIN',
                    interval: 300000
                },
                {
                    title: '10 MIN',
                    interval: 600000
                },
                {
                    title: '30 MIN',
                    interval: 1800000
                },
                {
                    title: '1 HOUR',
                    interval: 3600000
                },
                {
                    title: '3 HOURS',
                    interval: 10800000
                },
                {
                    title: '6 HOURS',
                    interval: 21600000
                },
                {
                    title: '12 HOURS',
                    interval: 43200000
                },
                {
                    title: '1 DAY',
                    interval: 86400000
                }
            ]
        };
    },
    setup() {
        const { updateSchedule, updateSchedules } = useBackupsStore;

        return {
            updateSchedule,
            updateSchedules
        };
    },
    methods: {
        onClick(item) {
            this.updateSchedule(this.added, item.interval);

            if (window.event.ctrlKey) {
                this.updateSchedules(item.interval);
            }
        }
    }
};
</script>
<style lang="postcss" scoped>
.schedule {
    width: 100%;
    border-top: 1px solid color-mod(var(--blue-color) a(7%));
    display: flex;
    flex-flow: column;
    animation: fade-up 0.3s var(--ease);

    & .tip {
        margin: 0 1rem 1rem 1rem;
        background-color: var(--white-color);
        color: var(--grey-color);
        font-weight: 600;
        font-size: 0.75rem;
        padding: 0.5rem 1.25rem;
        border-radius: 0.75rem;
    }

    & .items {
        width: 100%;
        display: flex;
        flex-flow: row wrap;
        padding: 1em 0 0 1em;

        & .item {
            user-select: none;
            cursor: pointer;
            margin: 0 1em 1em 0;
            border-radius: 0.75rem;
            border: 2px solid var(--white-color);
            transition: border-color 0.7s var(--ease);

            & span {
                display: flex;
                font-weight: 600;
                padding: 0.5rem 1rem;
                color: var(--grey-color);
                font-size: 0.8rem;
                background-color: var(--white-color);
                margin: 2px;
                border-radius: 0.6rem;
                transition: background-color 0.3s var(--ease), color 0.3s var(--ease);
            }

            &:first-child {
                &.active {
                    border: 2px solid color-mod(var(--grey-color) a(75%));

                    & span {
                        color: var(--back-color);
                        background-color: var(--grey-color);
                    }
                }
            }

            &.active {
                border: 2px solid color-mod(var(--blue-color) a(75%));

                & span {
                    color: var(--back-color);
                    background-color: var(--blue-color);
                }
            }
        }
    }
}
</style>
