import vuex from 'vuex'
import vue from 'vue'
vue.use(vuex)
var store = new vuex.Store({
    state:{
        singer:[],
        songs:[],
        isplay:false,
        isbig:true,
        currentindex:0,
        currentsong:null,
        hotimg:null,
        mysongs:[],
    },
    getters:{
        getmysongs:function(state)
        {
          return state.mysongs;
        },
        gethotimg:function(state)
        {
            return state.hotimg;
        },
      getsinger:function (state) {
          return state.singer
      },
      getsongs:function (state) {
            return state.songs
      },
      getplay:function (state) {
          return state.isplay
      },
        getindex:function (state) {
            return state.index
        },
        getcurrentsong:function (state) {
            return state.currentsong
        }
    },
    mutations:{
        setmysongs:function(state,songs)
        {
          state.mysongs = songs;
          var mysongs = songs.slice();
          for (var n=0;n<mysongs.length;n++)
          {
            if(mysongs[n].isopen)
            {
                mysongs[n].isopen=false
            }
          }
            localStorage.setItem('mysongs',JSON.stringify(mysongs))
        },
        sethotimg:function(state,url)
        {
            state.hotimg = url;
        },
        setsinger:function (state,singer) {
            state.singer=singer;
        },
        setsongs:function (state,songs) {
            state.songs=songs
        },
        setplay:function (state,boolean) {
            state.isplay=boolean;
        },
        setcurrentindex:function (state,index) {
            state.currentindex=index;
        },
        setcurrentsong:function (state,song) {
            state.currentsong = song;
        },
        setisbig:function (state,boolean) {
            state.isbig=boolean;
        }
    }
})

export default  store
