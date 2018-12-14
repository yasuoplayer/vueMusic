<template>
    <div class="app" @touchstart="ts" @touchmove="tm">
        <transition  name="in">
        <MySongs v-if="iscoll"></MySongs>
        </transition>
        <Mheader></Mheader>
        <Tab></Tab>
        <router-view></router-view>
        <maudio v-if="isplay"></maudio>
    </div>
</template>

<script>
    import Mheader from  './components/Mheader/Mheader'
    import Tab from  './components/Tab/Tab'
    import Maudio from './components/audio/audio'
    import MySongs from './components/MySongs/MySongs'
    export default {
        data:function()
        {
          return {
              iscoll:false,
              x:{
                  x1:0,
                  x2:0
              }
          }
        },
        components:{
            Mheader,
            Tab,
            Maudio,
            MySongs,
        },
        computed:{
            isplay:function () {
                return this.$store.getters.getplay
            }
        },
        created:function () {
            var mysongs = localStorage.getItem('mysongs');
            if(mysongs)
            {
                mysongs = JSON.parse(mysongs)

                this.$store.commit('setmysongs',mysongs)
            }
        },
        methods:{
            ts:function (e) {
                this.x.x1 = e.touches[0].clientX;
            },
            tm:function (e) {
                this.x.x2 = e.touches[0].clientX;
                if(Math.abs(this.x.x2-this.x.x1)>100)
                {
                    if(this.x.x2-this.x.x1>0)
                    {
                        this.iscoll = true
                    }
                    else
                    {
                        this.iscoll = false
                    }
                }
            },

        }
    }
</script>

<style scoped>
.app{
position:relative;
width:100%;
height:100%;
overflow:hidden;
}
    .in-enter,.in-leave-to
    {
        left: -100%;
        opacity: 0;
    }
    .in-enter-to,.in-leave
    {
        left: 0;
        opacity: 1;
    }
    .in-enter-active,.in-leave-active{
        transition: .5s all;
    }


</style>
