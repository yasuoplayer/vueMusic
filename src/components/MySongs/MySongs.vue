<template>

        <div class="mysongs" ref="scroll">
            <ul v-if="mysongs.length" >
                <li class="singer" v-for="(item,index) in mysongs" >
                    <p @click="toggleshow(index)"><span>{{item.singer}}</span> <span>{{item.isopen?'^':'v'}}</span></p>
                    <ul v-if="item.isopen">
                        <li class="singersongs" v-for="(song,index1) in item.songs"
                            :class="currentsong.songmid==song.songmid?'active':''"
                            @click.stop="select(song)">{{song.songname}}</li>
                    </ul>
                </li>
            </ul>
        </div>


</template>

<script>
    import BScroll from 'better-scroll'
    export default {
        data:function () {
            return {
                mysongs:[],
                currentsong:'',
            }
        },
        created:function () {
            this.getmysongs();
        },
        methods:{
            toggleshow:function(index)
            {
                this.mysongs[index].isopen = !this.mysongs[index].isopen
            },
            getmysongs:function () {
                this.mysongs = this.$store.getters.getmysongs;
            },
            select:function (song) {
                var list = this.mysongs;
                var songlist = [];
                var index = 0;
                for(var n=0;n<list.length;n++)
                {

                    songlist=songlist.concat(list[n].songs);
                }
                for(var n=0;n<songlist.length;n++)
                {
                    if(songlist[n].songmid==song.songmid)
                    {
                        index = n;
                        break;
                    }
                }
                this.currentsong = song;
                this.$store.commit('setcurrentsong',song);
                this.$store.commit('setcurrentindex',index);
                this.$store.commit('setsongs',songlist)
                this.$store.commit('setplay',true)
            }
        },
        computed:{
            getcurrentsong:function()
            {
              return this.$store.state.currentsong;
            },
            getsongs:function () {
                return this.$store.getters.getmysongs;
            }
        },
        watch:{
            getcurrentsong:function(n)
            {
              this.currentsong = n;
            },
            getsongs:function (n) {
                this.mysongs = n;
                if(!this.scroll&&n.length)
                {
                   this.$nextTick(()=>{
                       this.scroll = new BScroll(this.$refs.scroll,{
                           click:true
                       })
                   })
                }
            }
        }
    }
</script>

<style scoped>

    .active
    {
        color: red;
    }
    .mysongs{
        top: 0;
        left: 0;
        height: 693px;
        width: 200px;
        position: fixed;
        background: #F8F8FF;
        z-index: 9999;
        border-right: 2px yellow solid;
        color: #444;
        overflow: hidden;
    }
    .mysongs>ul{
        width: 100%;
    }
    .mysongs>ul>li{
        padding: 10px;
    }
    .singer span{
        font-size: 20px;
        margin-bottom: 5px;
        -ms-text-overflow: ellipsis;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    .singersongs
    {
        position: relative;
        padding: 10px 0px  5px 20px;
        overflow: hidden;
        -ms-text-overflow: ellipsis;
        text-overflow: ellipsis;
        white-space: nowrap;
        margin-bottom: 5px;
        font-size: 17px;
    }

</style>