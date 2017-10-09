<template>
<modal v-if="value.visible" @close="value.visible == false">
    <h3 slot="header">Cropper</h3>
    <div slot="description">
    Den her kan croppe
</div>
<div slot="body">
    <div class="cropper-wrapper aligner">
    <md-spinner class="loader" v-if="loader" md-indeterminate></md-spinner>

<md-button v-if="!file && !loader" class="aligner-item">
    Upload image
<label>
<input :name="uploadFieldName" accept="image/*" type="file"
                               @change="onImageChange"/>
    </label>
    </md-button>

    <div style="height: 100%; width: 100%;" class="cropper" v-show="file" :class="{'opacity-0' : loader}">
    <canvas height="100%" :id="id"></canvas>
    </div>
    </div>
    </div>
    <div slot="footer">
    <md-button v-on:click="close()">Luk</md-button>
    <md-button v-on:click="save()" class="save-btn">Gem
    </md-button>
    </div>
    </modal>
    </template>

    <style>
.cropper-wrapper {
    height: 300px;
}

.md-button input[type=file] {
    display: none;
}

.md-button label {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    top: 0;
}

.loader {
    position: absolute;
    z-index: 9999;
}

.cropper {
    opacity: 1;
    transition: opacity 200ms;
}

.opacity-0 {
    opacity: 0;
    transition: opacity 200ms;

}


</style>

<script>
var Cropper = require('cropperjs')
export default {
    name: 'cropper',
    props: ["value"],
    data: function () {
        return {
            uploadedFiles: [],
            uploadError: null,
            currentStatus: null,
            uploadFieldName: 'photo',
            id: "",
            file: null,
            file_upload: false,
            detail: {},
            cropper: null,
            temp_location: null,
            loader: false,
        }
    },

    watch: {
        value: function () {
            if (this.value.visible) {

            }
        }
    },

    methods: {

        onImageChange(ele) {

            this.loader = true;

            let files = ele.target.files || ele.dataTransfer.files;


            if (!files.length) {
                return;
            }

            let formData = new FormData();

            formData.append('image', files[0]);

            //this.form.append(ele.target.name, files[0]);
            this.$http.post('/profile/image/temp', formData).then(function (response) {
                    this.file = response.data.url;
                    this.temp_location = response.data.location;
                    console.log(this.cropper.replace(this.file));
                }
            )
            ;
        },

        close: function () {

            this.loader = false;
            this.file = null;
            this.cropper = null;

            this.$emit("input", {
                visible: false,
                image : null,
            });

        },
        makeid: function () {
            var text = "";
            var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

            for (var i = 0; i < 5; i++)
                text += possible.charAt(Math.floor(Math.random() * possible.length));

            return text;
        },

        save: function () {
            this.loader = true;

            let formData = new FormData();

            formData.append('location', this.temp_location);
            formData.append('details', this.detail);


            var data = {
                location: this.temp_location,
                details: this.detail
            };


            this.$http.post('/profile/image/update', data).then(function (response) {
                    this.file = response.data.url;

                    this.loader = false;
                    this.file = null;
                    this.cropper = null;

                    this.$emit("input", {
                        visible: false,
                        image: response.data.url
                    });


                }
            )
            ;
        }


    },
    created: function () {

        this.id = this.makeid();
    },

    updated: function () {

        if (this.cropper == null) {


            var image = this.$el.querySelector("#" + this.id);
            this.cropper = new Cropper(image, {
                aspectRatio: 1 / 1,
                crop: function (e) {
                    this.detail = e.detail;

                }.bind(this),
                ready: function (e) {
                    setTimeout(function () {
                        this.loader = false;
                    }.bind(this), 500)

                }.bind(this)
            });
            //this.v = JSON.parse(JSON.stringify(this.value));
            console.log(this.value);
        }
    }

}
</script>
