<template>
    <div class="search">
        <div class="searchpart">
            <div class="inputbox">
                <input type="text" placeholder="搜索歌曲、歌单、专辑" v-model="key"
                       @keyup.enter="submit"
                />
                <span class="close" v-if="key" @click="close">X</span>
            </div>
        </div>
        <div class="hotkey clearfix" :id="isbig?'':'sm'" v-if="!songlist.length">
            <a :href="spurl">{{spkey}}</a>
            <span v-for="(item,index) in keys" @click="choose(item.k)">{{item.k}}</span>
        </div>
        <div class="scroll" ref="scroll" :id="isbig?'':'sm'" v-if="songlist.length">
            <ul v-if="songlist.length">
                <li v-for="(item,index) in songlist" @click="select(item,index)">
                    <img :src='getimg(item.albummid)'>
                    <div class="info">
                        <p class="songname">{{item.songname}}</p>
                        <p class="singer">{{item.singer}}</p>
                    </div>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
    import  BScroll from 'better-scroll'
    export default {
        data:function () {
            return {
                spkey:null,
                spurl:null,
                keys:null,
                key:'',
                songlist:[],
                isbig:true,
            }
        },
        computed:{
          big:function () {
              return this.$store.state.isbig;
          }
        },
        created:function () {
            this.isbig =   this.$store.state.isbig;
            this.gethotkey();
        },
        watch:{
            big:function()
            {
                if(this.scroll)
                {
                    this.$nextTick(()=>{
                        this.scroll.refresh();

                    })
                }
              this.isbig =   this.$store.state.isbig;
            },
            songlist:function (n) {
                if(n.length)
                {
                    this.$nextTick(()=>{
                        var scroll = new BScroll(this.$refs.scroll,{
                            click:true
                        });
                        this.scroll = scroll;
                    })
                }

            }
        },
        methods:{
            getimg:function(id)
            {
                return `https://y.gtimg.cn/music/photo_new/T002R300x300M000${id}.jpg?max_age=2592000`
            },
            submit:function()
            {
                var key = this.key;
                this.search(key)
            },
          gethotkey:function () {
              this.$http.get('http://localhost:8888/api/getkey')
                  .then((res)=>{
                      this.spkey = res.body.data.special_key;
                      this.spurl = res.body.data.special_url;
                      this.keys = res.body.data.hotkey.slice(0,15);
                  })
          },
          search:function (key) {
                if(!key)
                {
                    this.songlist=[];
                    return
                }
                this.$http.get(`http://localhost:8888/api/search?key=${key}`)
                    .then((res)=>{
                        this.clear(res.body.data.song.list)
                    })
           },
            clear:function (arr) {
                var narr = [];
                for(var n=0;n<arr.length;n++)
                {
                    var im = arr[n];
                    var item ={
                        albummid:im.album.mid,
                        albumname:im.album.name,
                        singer:this.getsinger(im.singer),
                        songmid:im.file.media_mid,
                        songname:im.name
                    };
                    narr.push(item)
                }
                this.songlist = narr
            },
            getsinger:function (arr) {
                var narr =[];
                for(var n=0;n<arr.length;n++)
                {
                    narr.push(arr[n].name)
                }

                return narr.join('-')
            },
            close:function () {
                this.key=''
            },
            select:function (song,index) {
                this.$store.commit('setsongs',this.songlist);
                this.$store.commit('setcurrentindex',index);
                this.$store.commit('setcurrentsong',song);
                this.$store.commit('setplay',true);
            },
            choose:function (key) {
                this.key = key
                this.search(key)
            }
        },
    }
</script>

<style scoped>
    .songname
    {
        font-size: 20px;
        height: 70px;
        line-height: 70px;
        color: white;
        padding: 0 0 0 20px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
    .singer{
        font-size: 16px;
        height: 30px;
        line-height: 30px;
        color: white;
        padding: 0 0 0 20px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
    .hotkey,.scroll{
        background: white;
        padding: 20px 10px;
        height: 585px;
    }
    #sm{
        height: 515px;
    }
    .scroll{
        background: black;
        overflow: hidden;
    }
    ul>li{
        display: flex;
        color: black;
        height: 100px;
        padding: 10px;
    }
    img{
        flex: 1;
        height: 100px;
        width: 100px;
    }
    .info{
        flex: 4;
    }
    .clearfix:after{
        content: '';
        height: 0;
        visibility: hidden;
        display: block;
        clear: both;
    }
    .hotkey a{
        padding: 8px;
        border: 1px solid red;
        border-radius: 10px;
        margin: 4px;
        float: left;
    }
    .hotkey span
    {
        float: left;
        margin: 4px;
        padding: 8px;
        border: 1px solid black;
        border-radius: 10px;
        color: #333;
    }
    .close
    {
        color: #333 ;
        padding: 10px;
    }
    .searchpart
    {
        text-align: center;
        padding: 10px 0;
        background: #ccc;
    }
    .inputbox
    {
        width: 96%;
        margin: 0 auto;
        border-radius: 15px;
        background: white;
    }
    input
    {
        width: 300px;
        outline: none;
        height: 30px;
        border: none;
    }

</style>