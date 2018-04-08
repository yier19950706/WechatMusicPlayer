//获取应用实例
const app = getApp()

Page({
  data: {
    list: []
  },
  onLoad: function () {
    wx.getUserInfo({
      success: res => {
        app.globalData.userInfo = res.userInfo
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        });
      }
    });
    let _this = this;
    wx.request({
      url: 'http://localhost:3000/top/list?idx=1',
      success: function (res) {
        _this.setData({
          list: res.data.playlist.tracks
        })
      },
      fail: function (err) {
        console.log(err)
      }
    })
  },
  toPlay: function (e) {
    let global = app.globalData;
    let id = e.currentTarget.dataset.id;
    let playList = global.playList;

    // 如果当前歌曲存在于播放列表中，那么数据直接用
    let tempSong = playList.filter(item => item.id === id);
    console.log('tempSong-->', tempSong)
    if (tempSong.length === 1) {
      global.info = tempSong[0]
    } else {
      // 不存在的话，构建，然后添加到对应全局变量中
      const song = {
        id: id,
        title: e.currentTarget.dataset.title,
        singer: e.currentTarget.dataset.singer,
        album: e.currentTarget.dataset.album,
        picUrl: e.currentTarget.dataset.picurl
      }
      global.info = song;
      playList.push(song);
    }
    // 更新全局变量 id
    global.id = id;
    console.log('playList-->', playList)

    wx.switchTab({
      url: '/pages/play/play',
      success: function (res) {
        console.log('wx.switchTab')
      },
      fail: function (err) {
        console.log('跳转失败', err)
      }
    })
  }
})