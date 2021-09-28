const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const jsonfile = require('jsonfile');
const Application = require('../database/Application');
const ADMIN_ACCOUNT = require('../config/ADMIN_ACCOUNT');
const nodemailer = require('nodemailer')

const transport = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: '*',
        pass: '*',
    },
    tls: {
        rejectUnauthorized: false
    }
})

router.get('/auth', (req, res) => {
    res.redirect('/adminAuth.html');
});

router.post('/auth', (req, res) => {
    if (req.body.username === ADMIN_ACCOUNT.username && req.body.password === ADMIN_ACCOUNT.password) {
        req.session.isLogin = true;
        return res.redirect('admin');
    } else {
        req.session.destroy();
        return res.send("<script>alert('Invalid username or password!');location.href='/adminAuth.html'</script>");
    }
});

router.get('/logout', (req, res) => {
    req.session.destroy();
    return res.send("<script>alert('로그아웃되었습니다.');location.href='/'</script>");
});

router.get('/admin', async (req, res) => {
    try {
        if (req.session.isLogin === true) {
            return res.render('admin', {
                applications: await Application.find({}).sort({ updatedAt: 1 }),
                count: {
                    bySubmitted: await getCountBySubmitted(),
                    submittedByClass: await getSubmittedCountByClass(),
                    savedByClass: await getSavedCountByClass()
                },
                isBlocked: require('../config/status').isBlocked
            });
        } else {
            return res.send("<script>alert('Access Denied!');location.href='/'</script>");
        }
    } catch (err) {
        return res.send("<script>alert('알 수 없는 오류');location.href='/'</script>");
    }
});

router.post('/', async (req, res) => {
    try {
        if (req.session.isLogin === true) {
            let query = {};
            if (req.body.submissionStatus === 'submit') query = Object.assign(query, { isSubmitted: true });
            if (req.body.class !== 'None') query = Object.assign(query, { class: req.body.class });
            if (req.body.position !== 'None') query = Object.assign(query, { position: req.body.position });

            return res.render('admin', {
                applications: await Application.find(query).sort({ updatedAt: 1 }),
                count: {
                    bySubmitted: await getCountBySubmitted(),
                    submittedByClass: await getSubmittedCountByClass(),
                    savedByClass: await getSavedCountByClass()
                },
                isBlocked: require('../config/status').isBlocked
            });
        } else {
            return res.send("<script>alert('Access Denied!');location.href='/'</script>");
        }
    } catch (err) {
        return res.send("<script>alert('알 수 없는 오류');location.href='/'</script>");
    }
});

router.get('/application/:email', async (req, res) => {
    try {
        if (req.session.isLogin === true) {
            const application = await Application.findOne({ email: req.params.email });
            return res.render('application', { application: application });
        } else {
            return res.send("<script>alert('Access Denied!');location.href='/'</script>");
        }
    } catch (err) {
        return res.send("<script>alert('알 수 없는 오류');location.href='/'</script>");
    }
});

router.get('/delete/:email', async (req, res) => {
    try {
        if (req.session.isLogin === true) {
            const application = await Application.findOne({ email: req.params.email })
            // application.remove()
            return res.send("<script>alert('회원이 삭제되었습니다.');location.href='/admin'</script>");
        } else {
            return res.send("<script>alert('Access Denied!');location.href='/'</script>");
        }
    } catch (err) {
        return res.send("<script>alert('알 수 없는 오류');location.href='/'</script>");
    }
})
/*
router.get('/email', async (req, res) => {
    try {
        let email = new Array
        if (req.session.isLogin === true) {
            const application = await Application.find({}, { _id: false, email: true })

            for (let i = 0; i < application.length; i++) {
                email[i] = application[i].email
            }

            const mailOptions = {
                from: 'ssr.club.2019@gmail.com',
                to: email,
                subject: 'SSR동아리 합격통보',
                html: `<h1>합격을 축하드립니다.<h1>`
            }

            transport.sendMail(mailOptions, (err, response) => {
                if (err) {
                    new Error()
                } else {
                    console.log('Email sent: ' + response.message);
                    return res.send("<script>alert('이메일이 전송되었습니다.');location.href='/admin'</script>");
                }
                transport.close();
            })
        } else {
            return res.send("<script>alert('Access Denied!');location.href='/'</script>");
        }
    } catch (err) {
        return res.send("<script>alert('알 수 없는 오류');location.href='/'</script>");
    }
})
*/
router.get('/aisioasklwq', (req, res) => {
    try {
        if (req.session.isLogin === true) {
            const status = require('../config/status');
            status.isBlocked = !status.isBlocked;
            jsonfile.writeFile(__dirname + '/../config/status.json', status, { spaces: 2 }, err => {
                if (err) {
                    return res.send("<script>alert('알 수 없는 에러 발생');location.href='/admin'</script>");
                } else {
                    if (status.isBlocked) {
                        return res.send("<script>alert('모집 중단되었습니다.');location.href='/admin'</script>");
                    } else {
                        return res.send("<script>alert('모집 재개되었습니다.');location.href='/admin'</script>");
                    }
                }
            });
        } else {
            return res.send("<script>alert('Access Denied!');location.href='/'</script>");
        }
    } catch (err) {
        return res.send("<script>alert('알 수 없는 오류');location.href='/'</script>");
    }
});

async function getCountBySubmitted() {
    return {
        saved: await Application.find({ isSubmitted: false }).count(),
        submitted: await Application.find({ isSubmitted: true }).count(),
    };
}

async function getSavedCountByClass() {
    return {
        G1: await Application.find({ class: 'G1', isSubmitted: false }).count(),
        U1: await Application.find({ class: 'U1', isSubmitted: false }).count(),
        U2: await Application.find({ class: 'U2', isSubmitted: false }).count(),
        H1: await Application.find({ class: 'H1', isSubmitted: false }).count(),
        H2: await Application.find({ class: 'H2', isSubmitted: false }).count()
    };
}

async function getSubmittedCountByClass() {
    return {
        G1: await Application.find({ class: 'G1', isSubmitted: true }).count(),
        U1: await Application.find({ class: 'U1', isSubmitted: true }).count(),
        U2: await Application.find({ class: 'U2', isSubmitted: true }).count(),
        H1: await Application.find({ class: 'H1', isSubmitted: true }).count(),
        H2: await Application.find({ class: 'H2', isSubmitted: true }).count()
    };
}

module.exports = router;
