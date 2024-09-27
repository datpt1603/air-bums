const fs = require('fs');
const path = require('path');
const axios = require('axios');
const readline = require('readline');
const colors = require('colors');

const {getHashByTime} = require('./bumsgethash');
const { get } = require('http');

class Bums {
    constructor() {
        this.loginUrl = 'https://api.bums.bot/miniapps/api/user/telegram_auth';
        this.gameInfoUrl = 'https://api.bums.bot/miniapps/api/user_game_level/getGameInfo';
        this.tapUrl = 'https://api.bums.bot/miniapps/api/user_game/collectCoin';
        this.taskListUrl = 'https://api.bums.bot/miniapps/api/task/lists';
        this.taskFinishUrl = 'https://api.bums.bot/miniapps/api/task/finish_task';
        this.mineListUrl = 'https://api.bums.bot/miniapps/api/mine/getMineLists';
        this.upgradeUrl = 'https://api.bums.bot/miniapps/api/mine/upgrade';
        this.dailySignUrl = 'https://api.bums.bot/miniapps/api/sign/sign';
        this.signListsUrl = 'https://api.bums.bot/miniapps/api/sign/getSignLists';

        this.headers = {
            'Accept': 'application/json, text/plain, */*',
            'Accept-Encoding': 'gzip, deflate, br, zstd',
            'Accept-Language': 'en',
            'Origin': 'https://app.bums.bot',
            'Referer': 'https://app.bums.bot/',
            'sec-ch-ua': '"Microsoft Edge";v="129", "Not=A?Brand";v="8", "Chromium";v="129"',
            'sec-ch-ua-mobile': '?1',
            'sec-ch-ua-platform': '"Android"',
            'user-agent': 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Mobile Safari/537.36 Edg/129.0.0.0',
        }
    }

    async auth(initData) {
        const FormData = require('form-data');
        let data = new FormData();

        data.append('invitationCode', 'ref_jvI8RNYc');
        data.append('initData', initData);
        const response = await axios.post(this.loginUrl, data, {headers: {...this.headers, 'Authorization': 'Bearer null', 'Content-Type': 'multipart/form-data; boundary=----WebKitFormBoundarywphPfvZ46AbtTE6E'}});
        return response.data;
    }

    async countdown(t) {
        for (let i = t; i > 0; i--) {
            const hours = String(Math.floor(i / 3600)).padStart(2, '0');
            const minutes = String(Math.floor((i % 3600) / 60)).padStart(2, '0');
            const seconds = String(i % 60).padStart(2, '0');
            process.stdout.write(colors.white(`[*] Cần chờ ${hours}:${minutes}:${seconds}     \r`));
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
        process.stdout.write('                                        \r');
    }

    async getUserInfo(token) {
        const response = await axios.get(this.gameInfoUrl, {headers: {...this.headers, 'Authorization': `Bearer ${token}`}});
        return response.data.data;
    }

    async getGameInfo(token, accountNumber) {
        try {
            const response = await this.getUserInfo(token);
            const userInfo = response.userInfo;
            const gameInfo = response.gameInfo;
            const tapInfo = response.tapInfo;
            const mineInfo = response.mineInfo;

            console.log(`========== Tài khoản ${accountNumber + 1} | ${userInfo.nickName} ==========`);
            this.log(`ID: ${userInfo.userId}`);
            this.log(`Balance: ${gameInfo.coin}`);
            this.log(`Lợi nhuận mỗi giờ: ${mineInfo.minePower}`);
            this.log(`Level: ${gameInfo.level}`);
            this.log(`Energy Level: ${tapInfo.energy.level}`);
            this.log(`Energy: ${tapInfo.energy.value}`);
        } catch (error) {
            this.log(`Lỗi khi lấy dữ liệu người dùng cho tài khoản ${accountNumber + 1}: ${error.message}`, 'error');
        }
    }

    async guiTap(token, energy, collectSeqNo) {
        const hashKey = getHashByTime(collectSeqNo, energy);
        const FormData = require('form-data');
        let data = new FormData();

        data.append('hashCode', hashKey);
        data.append('collectSeqNo', collectSeqNo);
        data.append('collectAmount', energy);

        const response = await axios.post(this.tapUrl, data, {headers: {...this.headers, 'Authorization': `Bearer ${token}` , 'Content-Type': 'multipart/form-data; boundary=----WebKitFormBoundarywphPfvZ46AbtTE6E'}});
        return response.data;
    }

    async tap(token) {
        try {
            const userData = await this.getUserInfo(token);
            const energy = userData.gameInfo.energySurplus;
            const collectSeqNo = userData.tapInfo.collectInfo.collectSeqNo;
            const actionResponse = await this.guiTap(token, energy, collectSeqNo);
            if (actionResponse.msg == 'OK') {
                this.log(`Đã nhận ${energy} năng lượng`, 'success');
            } else {
                this.log(`Lỗi khi thực hiện tap: ${actionResponse.msg}`, 'error');
            }

        } catch (error) {
            this.log(`Lỗi khi thực hiện tap: ${error.message}`, 'error');
        }
    }

    async getListTask(token) {
        const response = await axios.get(this.taskListUrl, {headers: {...this.headers, 'Authorization': `Bearer ${token}`}});
        return response.data;
    }

    async finishTask(token, taskId) {
        try {
            const FormData = require('form-data');
            let data = new FormData();

            data.append('id', taskId);
            data.append('pwd', '');

            const response = await axios.post(this.taskFinishUrl, data, {headers: {...this.headers, 'Authorization': `Bearer ${token}` , 'Content-Type': 'multipart/form-data; boundary=----WebKitFormBoundarywphPfvZ46AbtTE6E'}});
            return response.data;
        } catch (error) {
            this.log(`Lỗi khi hoàn thành task: ${error.message}`, 'error');
            return {msg: 'ERROR'}
        }
    }

    async processTask(token) {
        try {
            const taskList = await this.getListTask(token);
            const tasks = taskList.data.lists.filter(task => task.isFinish == 0);

            tasks.forEach(async task => {
                let finishTask = await this.finishTask(token, task.id);

                if (finishTask.msg == 'OK') {
                    this.log(`Đã hoàn thành task: ${task.name}`, 'success');
                } else {
                    this.log(`Lỗi khi hoàn thành task: ${finishTask.msg}`, 'error');
                }

                await this.countdown(Math.floor(20));
            });
        } catch (error) {
            this.log(`Lỗi khi thực hiện task: ${error.message}`, 'error');
        }
    }

    async getMineLists(token) {
        const response = await axios.post(this.mineListUrl, {}, {headers: {...this.headers, 'Authorization': `Bearer ${token}`}});
        return response.data;
    }

    async upgradeMine(token, mineId) {
        const FormData = require('form-data');
        let data = new FormData();

        data.append('mineId', `${mineId}`);

        const response = await axios.post(this.upgradeUrl, data, {headers: {...this.headers, 'Authorization': `Bearer ${token}` , 'Content-Type': 'multipart/form-data; boundary=----WebKitFormBoundarywphPfvZ46AbtTE6E'}});
        return response.data;
    }

    async processUpgrade(token) {
        try {
            const mines = await this.getMineLists(token);

            if (mines.msg == 'OK') {
                const userData = await this.getUserInfo(token);
                let money = userData.gameInfo.coin;

                for (const mine of mines.data.lists) {
                    while ((money - mine.nextLevelCost) > 0 && mine.limitText == '') {
                        try {
                            let level = mine.level;
                            this.log(`Thực hiện nâng cấp mine ${mine.mineId} lên level ${level + 1}`, 'info');
                            const upgradeResponse = await this.upgradeMine(token, mine.mineId);
                            if (upgradeResponse.msg == 'OK') {
                                money -= mine.nextLevelCost;
                                this.log(`Đã nâng cấp mine ${mine.mineId} lên level ${level + 1}`, 'success');
                            } else {
                                this.log(`Lỗi khi thực hiện nâng cấp: ${upgradeResponse.msg}`, 'error');
                                break;
                            }

                            const mines = await this.getMineLists(token);
                            if (mines.msg == 'OK') {
                                mine = mines.data.lists.find(mine => mine.mineId == mine.mineId);
                                if (mine.limitText != '') {
                                    this.log(`Không thể nâng cấp ${mine.mineId}: ${mine.limitText}`, 'warning');
                                    break;
                                }
                            }
                        } catch (error) {
                            this.log(`Lỗi khi thực hiện nâng cấp: ${error.message}`, 'error');
                            break;
                        }
                    }
                }
            }
        } catch (error) {
            this.log(`Lỗi khi thực hiện nâng cấp: ${error.message}`, 'error');
        }
    }

    async getSignLists(token) {
        const response = await axios.get(this.signListsUrl, {headers: {...this.headers, 'Authorization': `Bearer ${token}`}});
        return response.data;
    }

    async dailySign(token) {
        try {
            const signLists = await this.getSignLists(token);
            if (signLists.msg == 'OK' && signLists.data.signStatus == 0) {
                const response = await axios.post(this.dailySignUrl, {}, {headers: {...this.headers, 'Authorization': `Bearer ${token}`}, 'Content-Type': 'multipart/form-data; boundary=----WebKitFormBoundaryuHAJdP48FwnsoF9N'});
                if (response.data.msg == 'OK') {
                    this.log('Đã nhận phần thưởng daily sign', 'success');
                }
            }
        } catch (error) {
            this.log(`Lỗi khi thực hiện daily sign: ${error.message}`, 'error');
        }
    }

    async main() {
        const dataFile = path.join(__dirname, 'data.txt');
        const initDataList = fs.readFileSync(dataFile, 'utf8')
            .replace(/\r/g, '')
            .split('\n')
            .filter(Boolean);

        while (true) {
            for (let no = 0; no < initDataList.length; no++) {
                const initData = initDataList[no];
                try {
                    const authResponse = await this.auth(initData);
                    if (authResponse.msg == 'OK') {
                        const token = authResponse.data.token;

                        await this.getGameInfo(token, no);
                        await this.tap(token);

                        await this.countdown(Math.floor(10));

                        await this.processTask(token);

                        await this.countdown(Math.floor(10));

                        await this.processUpgrade(token);

                        await this.countdown(Math.floor(10));

                        await this.dailySign(token);
                    } else {
                        this.log(`Lỗi khi xác thực tài khoản ${no + 1}: ${authResponse.msg}`, 'error');
                    }

                } catch (error) {
                    this.log(`Lỗi khi xử lý tài khoản ${no + 1}: ${error.message}`, error);
                }
            }

            await this.waitWithCountdown(Math.floor(120));
        }
    }

    log(msg, type = 'info') {
        const timestamp = new Date().toLocaleTimeString();
        switch(type) {
            case 'success':
                console.log(`[${timestamp}] [*] ${msg}`.green);
                break;
            case 'custom':
                console.log(`[${timestamp}] [*] ${msg}`.magenta);
                break;        
            case 'error':
                console.log(`[${timestamp}] [!] ${msg}`.red);
                break;
            case 'warning':
                console.log(`[${timestamp}] [*] ${msg}`.yellow);
                break;
            default:
                console.log(`[${timestamp}] [*] ${msg}`);
        }
    }

    async waitWithCountdown(seconds) {
        for (let i = seconds; i >= 0; i--) {
            readline.cursorTo(process.stdout, 0);
            process.stdout.write(`===== Đã hoàn thành tất cả tài khoản, chờ ${i} giây để tiếp tục vòng lặp =====`);
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
        console.log('');
    }
}

if (require.main === module) {
    const bums = new Bums();
    bums.main().catch(err => {
        console.error(err);
        process.exit(1);
    });
}