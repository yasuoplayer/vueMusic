<template>
    <div class="songList">
        <ul>
            <li v-for="(item,index) in list">
                <img v-lazy="item.imgurl">
                <div class="name">{{item.dissname}}</div>
            </li>
        </ul>
    </div>
</template>

<script>
    import vueresource from 'vue-resource'
    import vue from 'vue'
    import lz from 'vue-lazyload'
    vue.use(lz,{
        loading:require('./default.png')
    });
    vue.use(vueresource);
    export default {
        data:function () {
            return {
                list:[]
            }
        },
        created:function () {
            this.$http.get('http://localhost:8888/api/songlist').then((res)=>{
                this.list = res.body.data.list
            })
        }
    }
</script>

<style scoped>
    img{
        display: block;
        width: 60px;
        height: 60px;
        float: left;
        margin-top: 10px ;
    }
 ul{
     padding: 0 50px;
 }
   ul li
    {
       height: 80px
    }

    ul li .name
    {
        float: left;
        line-height: 80px;
        margin-left: 40px;
    }


</style>
