import express from 'express';
import multer from 'multer';
import path from 'path';
import Reimbursement from '../models/Reimbursement';

const router = express.Router();

// 配置 multer 用于文件上传
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 20 * 1024 * 1024 }, // 限制文件大小为 20MB
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|pdf/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('只允许上传图片和PDF文件！'));
    }
  }
});

// 提交报销申请
router.post('/', upload.single('attachment'), async (req, res) => {
  try {
    const { date, name, department, expenses } = req.body;
    const expensesArray = JSON.parse(expenses);

    const totalAmount = expensesArray.reduce((sum: number, expense: any) => sum + Number(expense.amount), 0);

    const newReimbursement = new Reimbursement({
      date,
      name,
      department,
      expenses: expensesArray,
      totalAmount,
      attachmentPath: req.file ? req.file.path : undefined
    });

    await newReimbursement.save();
    res.status(201).json({ message: '报销申请提交成功', reimbursement: newReimbursement });
  } catch (error) {
    console.error('提交报销申请时出错：', error);
    res.status(500).json({ message: '服务器错误，请稍后再试' });
  }
});

// 获取所有报销申请
router.get('/', async (req, res) => {
  try {
    const reimbursements = await Reimbursement.find().sort({ createdAt: -1 });
    res.json(reimbursements);
  } catch (error) {
    console.error('获取报销申请列表时出错：', error);
    res.status(500).json({ message: '服务器错误，请稍后再试' });
  }
});

// 获取单个报销申请详情
router.get('/:id', async (req, res) => {
  try {
    const reimbursement = await Reimbursement.findById(req.params.id);
    if (!reimbursement) {
      return res.status(404).json({ message: '未找到该报销申请' });
    }
    res.json(reimbursement);
  } catch (error) {
    console.error('获取报销申请详情时出错：', error);
    res.status(500).json({ message: '服务器错误，请稍后再试' });
  }
});

// 更新报销申请状态
router.patch('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const reimbursement = await Reimbursement.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!reimbursement) {
      return res.status(404).json({ message: '未找到该报销申请' });
    }
    res.json({ message: '报销申请状态已更新', reimbursement });
  } catch (error) {
    console.error('更新报销申请状态时出错：', error);
    res.status(500).json({ message: '服务器错误，请稍后再试' });
  }
});

export default router;