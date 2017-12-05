// ==UserScript==
// @name         autoPublishJbToArs
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        http://jb.oa.com/dist/test
// @grant        none
// ==/UserScript==

(function() {
    'use strict'
    var $refreshBtn = $('#btnRefresh')
    $refreshBtn.after('<button id="autoPublishArs" style="position:absoluteright:350px">publishJb2Ars</button>')
    var $autoPublishArs = $('#autoPublishArs')
    $autoPublishArs.on('click', function() {
        $('#btnPro')[0].click()
        setTimeout(function(){
            $('.x-btn-default-small-noicon:contains("预编译")').click()

            var $compilingTip = $('.x-window-blue-window-closable.x-window-active')

            // 持续检查是否编译完成
            var compilationDetectionKey = setInterval(function() {
                if (!$compilingTip.hasClass('x-window-active')) {
                    clearInterval(compilationDetectionKey)

                    var jbId = $('#textfield-1047-inputEl').val()
                    var svn = $('#textfield-1048-inputEl').val()

                    $.ajax('//jb.oa.com/dist/test/ars', {
                        type: 'post',
                        data: {
                            id: jbId,
                            svn: svn
                        },
                        dataType: 'json'
                    }).done(function(res) {
                        if(res.code){
                            alert(JSON.stringify(res.msg))
                        }
                        var msgs = res.msg

                        msgs.forEach(function (innerRes) {
                            var innerResMsg = JSON.parse(innerRes.msg)
                            if (innerRes.code !== 0) {
                                alert(JSON.stringify(innerResMsg))
                            }
                        })

                        var releaseTags = msgs.filter(function (item) {
                            return item.code === 0
                        }).map(function (item) {
                            var msg = JSON.parse(item.msg)
                            return msg.releasetag
                        })
                        if (releaseTags.length === 1) {
                            window.open('http://ars.sng.local/arsphp/index.php/release?tag=' + releaseTags[0] + '&autoArs=1&publishStage=test', 'alloy_auto_ars')
                        } else if (releaseTags.length > 1) {
                            var msg = releaseTags.reduce(function (preventValue, item) {
                                return preventValue + '<br><a href="http://ars.sng.local/arsphp/index.php/release?tag=' + item + '" target="_blank">' + item + '</a>'
                            }, '生成了多个ars单')
                            alert(msg)
                        }
                    })
                }
            }, 1000)
        })
    })
})()