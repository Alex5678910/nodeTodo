const {Router} = require('express')
const router = Router()
const User = require('../models/User')
const {check, validationResult} = require('express-validator')
const bcrypt = require('bcryptjs') //закрывает наш пароль(хеширует от взлома)
const jwtToken = require('jsonwebtoken')

router.post('/registration',
    [
        check('email', 'Некоректный email').isEmail(), //проверка почты
        check('password', 'Некоректный password').isLength({ min: 5 }) //проверка пароля длчины
    ],
    async (req, res) => {
        try {
            const errors = validationResult(req)
            if(!errors.isEmpty()){
                return res.status(400).json({
                    errors: errors.array(),
                    message: 'Некоректные данные'
                })
            }
            const { email, password } = req.body //отправка данных на бэк

            const isUsed = await User.findOne({ email })//findOne команда из MongoDB
            //Функция findOne () используется для поиска одного документа в соответствии с условием.
            // Если несколько документов соответствуют условию, возвращается первый документ, удовлетворяющий условию.

            if(isUsed){
                return res.status(300).json({message: 'Данный Email уже занят , попробуйте другой'})
            }

            const hashedPassword = await bcrypt.hash(password, 12) //закрывает наш пароль(хеширует от взлома)

            const user = new User({
                email, password: hashedPassword
            })

            await user.save()

            res.status(201).json({message: 'Пользователь создан'})
        } catch (e) {
            console.error(e)
        }
    })


router.post('/login',
    [
        check('email', 'Некоректный email').isEmail(),
        check('password', 'Некоректный password').exists()
    ],
    async (req, res) => {
        try {
            const errors = validationResult(req)
            if(!errors.isEmpty()){
                return res.status(400).json({
                    errors: errors.array(),
                    message: 'Некоректные данные'
                })
            }
            const { email, password } = req.body

            const user = await User.findOne({ email }) //findOne команда из MongoDB

            if(!user){
                return res.status(400).json({message: ' Такого Email нет в базе'})
            }

            const isMatch = bcrypt.compare(password, user.password)

            if(!isMatch){
                return res.status(400).json({message: ' Пароли не совпадают'})
            }

            const jwtSecret = '08776775'
            const token = jwtToken.sign(
                {userId: user.id},
                jwtSecret,
                {expiresIn: '1h'}
            )

            res.json({token, userId: user.id})

        } catch (e) {
            console.error(e)
        }
    })

module.exports = router


