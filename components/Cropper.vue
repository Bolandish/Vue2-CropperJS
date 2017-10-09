<template>
    <div :style="{ width : width, height : height }" class="cropper">
        <canvas height="100%" width="100%" :id="id"></canvas>
    </div>
</template>

<script>
    export default {
        name: 'cropper',
        props: {
            value: {
                type: String,
                required: true
            },
            width: {
                type: String,
                default: "100%"
            },
            height: {
                type: String,
                default: "100%"
            },
            'aspect-ratio': {
                type: Number,
                default: 1/1
            }
        },
        props: ["value", "width", "height", "asp"],
        data: function () {
            return {
                v: this.value,
                details: null
            }
        },

        watch: {
            value: function () {
                this.v = this.value;
                this.cropper.replace(this.value)
            },
            v: function () {
                this.$emit("input", this.v);
            }
        },

        methods: {},
        created: function () {
            this.id = this.makeid();
        },

        updated: function () {

            if (this.cropper == null) {
                var image = this.$el.querySelector("#" + this.id);
                this.cropper = new CropperJS(image, {
                    aspectRatio: this.aspect-ratio,
                    crop: function (e) {
                        this.detail = e.detail;
                        this.$emit("crop", e.detail)

                    }.bind(this),
                    ready: function (e) {
                        this.$emit("ready", e.detail)
                        this.cropper.replace(this.value);
                    }.bind(this)
                });
            }
        }

    }
</script>
