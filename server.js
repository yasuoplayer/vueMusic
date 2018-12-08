const url = "https://c.y.qq.com/splcloud/fcgi-bin/fcg_get_diss_by_tag.fcg";
const express = require('express');
const axios = require('axios');
var querystring = require('querystring');
const app  = express();
const apiRouter = express.Router();

apiRouter.get('/songlist',(req,res)=>{
    res.setHeader('Access-Control-Allow-Origin','*');
    axios({
        method: 'get',
        url:'https://c.y.qq.com/splcloud/fcgi-bin/fcg_get_diss_by_tag.fcg?picmid=1&rnd=0.4662310252656452&g_tk=5381&loginUin=0&hostUin=0&format=json&inCharset=utf8&outCharset=utf-8&notice=0&platform=yqq&needNewCode=0&categoryId=10000000&sortId=5&sin=0&ein=29',
        headers:{
            host:"c.y.qq.com",
            referer:"https://y.qq.com/"
        }
    }).then((response)=>{
        res.json(response.data)
    })
})

apiRouter.get('/getLyric',(req,res)=>{
    res.setHeader('Access-Control-Allow-Origin','*');
    const url = 'https://c.y.qq.com/lyric/fcgi-bin/fcg_query_lyric_new.fcg'+'?'+querystring.stringify(req.query);
    axios({
        method: 'get',
        url:url,
        headers:{
            host:"c.y.qq.com",
            referer:"https://y.qq.com/"
        }
    }).then((response)=>{
        let string = response.data;
        let start = string.indexOf('{');
        let end = string.lastIndexOf('}')+1;
        string = string.slice(start,end);
		res.end(string)
        
    })
})

apiRouter.get('/getrank',(req,res)=>{
    res.setHeader('Access-Control-Allow-Origin','*');
    const url = 'https://c.y.qq.com/v8/fcg-bin/fcg_myqq_toplist.fcg?g_tk=5381&uin=0&format=json&inCharset=utf-8&outCharset=utf-8&notice=0&platform=h5&needNewCode=1&_=1542253180857';
    axios({
        method: 'get',
        url:url,
        headers:{
            host:"c.y.qq.com",
            referer:"https://y.qq.com/"
        }
    }).then((resp)=>{
        res.json(resp.data)
    })
})

apiRouter.get('/getranksong',(req,res)=>{
    res.setHeader('Access-Control-Allow-Origin','*');
	var id = req.query.id;
    const url = `https://c.y.qq.com/v8/fcg-bin/fcg_v8_toplist_cp.fcg?g_tk=5381&uin=0&format=json&inCharset=utf-8&outCharset=utf-8&notice=0&platform=h5&needNewCode=1&tpl=3&page=detail&type=top&topid=${id}&_=1542267040555`;
    axios({
        method: 'get',
        url:url,
        headers:{
            host:"c.y.qq.com",
            referer:"https://y.qq.com/"
        }
    }).then((resp)=>{
		try{
			res.json(resp.data)
		}
		catch(e)
		{
			console.log(e)
		}
    })
})

apiRouter.get('/getkey',(req,res)=>{
    res.setHeader('Access-Control-Allow-Origin','*');
    const url = `https://c.y.qq.com/splcloud/fcgi-bin/gethotkey.fcg?g_tk=5381&uin=0&format=json&inCharset=utf-8&outCharset=utf-8&notice=0&platform=h5&needNewCode=1&_=1542273196556`;
    axios({
        method: 'get',
        url:url,
        headers:{
            host:"c.y.qq.com",
            referer:"https://y.qq.com/"
        }
    }).then((resp)=>{
        res.json(resp.data)
    })
})


apiRouter.get('/search',(req,res)=>{
    res.setHeader('Access-Control-Allow-Origin','*');
	var key = req.query.key;
	key = encodeURI(key)
    const url = `https://c.y.qq.com/soso/fcgi-bin/client_search_cp?ct=24&qqmusic_ver=1298&new_json=1&remoteplace=txt.yqq.center&searchid=36630826952256935&t=0&aggr=1&cr=1&catZhida=1&lossless=0&flag_qc=0&p=1&n=20&w=${key}&g_tk=1742895503&loginUin=0&hostUin=0&format=json&inCharset=utf8&outCharset=utf-8&notice=0&platform=yqq&needNewCode=0`;
    axios({
        method: 'get',
        url:url,
        headers:{
            host:"c.y.qq.com",
            referer:"https://y.qq.com/"
        }
    }).then((response)=>{
		try{
			res.json(response.data)
		}
		catch(e)
		{
			console.log(e)
		}
    })
})

app.use('/api',apiRouter);
app.listen(8888)
