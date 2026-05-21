import type { Expert } from '../types';

export const mockExperts: Expert[] = [
  // ── S 级（5人）──────────────────────────────────────────
  {
    id: 'e001', name: '张晓晨', phone: '13800100001',
    education: '硕士', work_years: 8, industry: '互联网', profession: '算法工程师',
    scenes: ['Coding', 'Agent'], tools: ['Cursor', 'Claude Code', 'GPT-4', 'GitHub Copilot'],
    daily_hours: 4, response_speed: '快', level: 'S',
    total_score: 94, avg_score: 91, bonus_score: 5, task_count: 12,
    status: 'active',
    ability_qa: {
      llm_experience: '使用大模型3年以上，深度使用GPT-4、Claude系列进行代码辅助和Agent开发，参与过多个LLM产品的内测评估。',
      common_tools: 'Cursor每日使用，Claude Code用于复杂重构，GPT-4用于架构设计讨论。',
      prompt_example: '你是一个资深代码审查工程师，请审查以下Python代码的安全性、性能和可读性，并给出具体改进建议，包括代码示例。',
      self_evaluation: '对代码质量有高标准，能识别细微的逻辑错误和性能问题，熟悉主流LLM的输出特点和局限性。'
    },
    created_at: '2024-01-10', updated_at: '2026-04-20'
  },
  {
    id: 'e002', name: '李雨欣', phone: '13800100002',
    education: '博士', work_years: 10, industry: 'AI研究', profession: 'NLP研究员',
    scenes: ['Agent', '通用'], tools: ['Claude Code', 'Gemini', 'Perplexity', 'Notion AI'],
    daily_hours: 3, response_speed: '快', level: 'S',
    total_score: 92, avg_score: 87, bonus_score: 10, task_count: 15,
    status: 'active',
    ability_qa: {
      llm_experience: '博士研究方向即LLM对齐与评估，发表过相关论文，有丰富的模型能力边界认知。',
      common_tools: 'Claude Code用于research辅助，Perplexity用于资料检索，自建评估框架。',
      prompt_example: '请用链式思维(CoT)分析以下复杂推理题，每步给出推理依据，最后给出答案并说明置信度。',
      self_evaluation: '擅长识别模型的推理错误和幻觉，能从学术角度评估模型能力，注重评估的科学性。'
    },
    created_at: '2023-11-05', updated_at: '2026-05-01'
  },
  {
    id: 'e003', name: '王建国', phone: '13800100003',
    education: '本科', work_years: 12, industry: '金融科技', profession: '技术总监',
    scenes: ['Coding', 'Agent'], tools: ['GitHub Copilot', 'Claude Code', 'GPT-4', 'Cursor'],
    daily_hours: 2, response_speed: '快', level: 'S',
    total_score: 91, avg_score: 88, bonus_score: 5, task_count: 9,
    status: 'active',
    ability_qa: {
      llm_experience: '主导了公司内部AI编程助手落地项目，评估过10+款编程辅助工具。',
      common_tools: 'GitHub Copilot为主，Claude Code处理复杂逻辑，Cursor用于重构任务。',
      prompt_example: '你是高级软件架构师，请为电商平台设计一个高可用的订单系统，需要考虑并发、数据一致性和扩展性，用图表说明架构。',
      self_evaluation: '有丰富的工程实践经验，能从业务价值角度评估AI辅助效果，判断力准确。'
    },
    created_at: '2024-02-15', updated_at: '2026-04-10'
  },
  {
    id: 'e004', name: '陈思远', phone: '13800100004',
    education: '硕士', work_years: 6, industry: '游戏', profession: '游戏开发工程师',
    scenes: ['Coding'], tools: ['Cursor', 'GitHub Copilot', 'ChatGPT', 'Tabnine'],
    daily_hours: 5, response_speed: '快', level: 'S',
    total_score: 93, avg_score: 90, bonus_score: 5, task_count: 8,
    status: 'active',
    ability_qa: {
      llm_experience: '游戏引擎开发中深度使用AI辅助，尤其擅长评估代码逻辑正确性和性能优化建议质量。',
      common_tools: 'Cursor为核心编码工具，GitHub Copilot补全为辅，每日使用时长4小时+。',
      prompt_example: '实现一个Unity中的A*寻路算法，需要支持动态障碍物，并针对移动平台做性能优化，附单元测试。',
      self_evaluation: '代码审查能力强，对算法和数据结构有深刻理解，能发现AI代码中的边界条件错误。'
    },
    created_at: '2024-03-20', updated_at: '2026-05-05'
  },
  {
    id: 'e005', name: '刘芳菲', phone: '13800100005',
    education: '博士', work_years: 9, industry: '教育科技', profession: 'AI产品负责人',
    scenes: ['Agent', '通用'], tools: ['Claude Code', 'Perplexity', 'Notion AI', 'GPT-4'],
    daily_hours: 3, response_speed: '中', level: 'S',
    total_score: 90, avg_score: 85, bonus_score: 10, task_count: 11,
    status: 'active',
    ability_qa: {
      llm_experience: '负责教育AI产品线，组织过多轮用户研究和模型能力评估，有系统化评估方法论。',
      common_tools: 'Claude Code用于Agent任务设计，Perplexity辅助研究，Notion AI做内容生产评估。',
      prompt_example: '设计一个自适应学习系统的Agent，能够根据学生的错误模式动态调整题目难度和解题思路引导。',
      self_evaluation: '产品思维强，能从用户体验角度评估模型输出，擅长发现指令跟随方面的问题。'
    },
    created_at: '2023-12-01', updated_at: '2026-04-28'
  },

  // ── A 级（15人）──────────────────────────────────────────
  {
    id: 'e006', name: '赵宇航', phone: '13800100006',
    education: '硕士', work_years: 5, industry: '互联网', profession: '后端工程师',
    scenes: ['Coding', 'Agent'], tools: ['Cursor', 'Claude Code', 'ChatGPT'],
    daily_hours: 3, response_speed: '快', level: 'A',
    total_score: 85, avg_score: 82, bonus_score: 5, task_count: 7,
    status: 'active',
    ability_qa: {
      llm_experience: '日常使用AI辅助后端开发，熟悉Python/Go/Java的AI代码生成质量特点。',
      common_tools: 'Cursor为主力，Claude Code处理复杂业务逻辑。',
      prompt_example: '用Go实现一个并发安全的缓存组件，支持TTL过期、LRU淘汰，附完整测试。',
      self_evaluation: '对代码质量有较高要求，能识别常见的并发问题和性能瓶颈。'
    },
    created_at: '2024-04-01', updated_at: '2026-03-15'
  },
  {
    id: 'e007', name: '孙雪梅', phone: '13800100007',
    education: '本科', work_years: 7, industry: '电商', profession: '数据分析师',
    scenes: ['通用', 'Agent'], tools: ['ChatGPT', 'Claude', 'Copilot'],
    daily_hours: 2, response_speed: '中', level: 'A',
    total_score: 78, avg_score: 75, bonus_score: 5, task_count: 6,
    status: 'active',
    ability_qa: {
      llm_experience: '用AI进行数据分析报告撰写和SQL生成，有丰富的通用任务评估经验。',
      common_tools: 'ChatGPT用于写作，Claude用于长文分析，Copilot辅助Python。',
      prompt_example: '分析以下销售数据，找出异常趋势，给出原因假设和后续行动建议，用结构化格式输出。',
      self_evaluation: '善于发现语言表达中的逻辑漏洞，对输出的准确性和可信度有较强判断力。'
    },
    created_at: '2024-05-10', updated_at: '2026-02-20'
  },
  {
    id: 'e008', name: '周志强', phone: '13800100008',
    education: '硕士', work_years: 4, industry: '医疗科技', profession: '软件工程师',
    scenes: ['Coding'], tools: ['GitHub Copilot', 'ChatGPT', 'Cursor'],
    daily_hours: 4, response_speed: '快', level: 'A',
    total_score: 82, avg_score: 80, bonus_score: 0, task_count: 5,
    status: 'active',
    ability_qa: {
      llm_experience: '医疗软件领域使用AI辅助，对代码安全性和合规性特别敏感。',
      common_tools: 'GitHub Copilot日常补全，ChatGPT用于设计讨论，Cursor复杂重构。',
      prompt_example: '实现医疗数据加密存储模块，需符合HIPAA规范，附安全审计说明。',
      self_evaluation: '注重安全性和可靠性，能发现代码中潜在的安全漏洞。'
    },
    created_at: '2024-06-01', updated_at: '2026-04-05'
  },
  {
    id: 'e009', name: '吴小燕', phone: '13800100009',
    education: '本科', work_years: 5, industry: '广告', profession: '前端工程师',
    scenes: ['Coding', '通用'], tools: ['Cursor', 'v0', 'ChatGPT', 'GitHub Copilot'],
    daily_hours: 3, response_speed: '快', level: 'A',
    total_score: 80, avg_score: 77, bonus_score: 5, task_count: 6,
    status: 'active',
    ability_qa: {
      llm_experience: '主要用AI做前端开发，包括组件生成、样式调整和交互逻辑。',
      common_tools: 'Cursor为主，v0用于UI原型，GitHub Copilot补全。',
      prompt_example: '用React实现可拖拽排序的任务看板，支持卡片状态切换、标签筛选，附键盘导航支持。',
      self_evaluation: '对UI交互细节敏感，能识别前端代码中的可访问性和性能问题。'
    },
    created_at: '2024-04-15', updated_at: '2026-03-30'
  },
  {
    id: 'e010', name: '郑浩然', phone: '13800100010',
    education: '博士', work_years: 11, industry: 'AI研究', profession: '计算机视觉研究员',
    scenes: ['Coding', 'Agent'], tools: ['GPT-4', 'Claude Code', 'Cursor'],
    daily_hours: 2, response_speed: '慢', level: 'A',
    total_score: 75, avg_score: 72, bonus_score: 5, task_count: 4,
    status: 'active',
    ability_qa: {
      llm_experience: '研究中使用AI辅助论文写作和代码实验，对模型输出的科学严谨性有高要求。',
      common_tools: 'GPT-4用于文献综述，Claude Code用于实验代码，Cursor日常开发。',
      prompt_example: '解释Transformer注意力机制中的位置编码，用公式推导说明为什么RoPE优于绝对位置编码。',
      self_evaluation: '技术深度强，善于评估AI在专业技术领域的准确性，发现技术幻觉能力突出。'
    },
    created_at: '2024-07-01', updated_at: '2026-01-15'
  },
  {
    id: 'e011', name: '黄晓华', phone: '13800100011',
    education: '硕士', work_years: 6, industry: '网络安全', profession: '安全工程师',
    scenes: ['Coding', 'Agent'], tools: ['Claude Code', 'ChatGPT', 'GitHub Copilot'],
    daily_hours: 3, response_speed: '快', level: 'A',
    total_score: 84, avg_score: 81, bonus_score: 5, task_count: 6,
    status: 'active',
    ability_qa: {
      llm_experience: '用AI辅助渗透测试报告和安全代码审查，对代码安全性评估有专业积累。',
      common_tools: 'Claude Code做代码安全分析，ChatGPT辅助报告写作。',
      prompt_example: '审查以下Python Web代码，找出所有OWASP Top 10安全漏洞，给出严重等级和修复方案。',
      self_evaluation: '安全意识强，能发现AI代码中的安全漏洞，对指令注入攻击识别能力强。'
    },
    created_at: '2024-03-05', updated_at: '2026-04-25'
  },
  {
    id: 'e012', name: '冯艳丽', phone: '13800100012',
    education: '本科', work_years: 8, industry: '零售', profession: '产品经理',
    scenes: ['通用', 'Agent'], tools: ['ChatGPT', 'Claude', 'Notion AI'],
    daily_hours: 2, response_speed: '中', level: 'A',
    total_score: 76, avg_score: 73, bonus_score: 5, task_count: 5,
    status: 'active',
    ability_qa: {
      llm_experience: '用AI辅助PRD撰写、竞品分析和用户研究，擅长评估业务场景中的AI输出质量。',
      common_tools: 'ChatGPT写PRD，Claude用于长文档分析，Notion AI做会议纪要。',
      prompt_example: '为一款社区团购App设计用户留存策略，需结合行为数据分析，输出可执行的运营方案。',
      self_evaluation: '业务敏感度高，能从用户价值角度评估AI输出，擅长识别逻辑矛盾。'
    },
    created_at: '2024-05-20', updated_at: '2026-03-10'
  },
  {
    id: 'e013', name: '杨明志', phone: '13800100013',
    education: '硕士', work_years: 3, industry: '互联网', profession: '机器学习工程师',
    scenes: ['Coding', 'Agent'], tools: ['Cursor', 'Claude Code', 'GitHub Copilot', 'ChatGPT'],
    daily_hours: 4, response_speed: '快', level: 'A',
    total_score: 83, avg_score: 80, bonus_score: 5, task_count: 7,
    status: 'active',
    ability_qa: {
      llm_experience: '机器学习开发中大量使用AI，对模型代码生成质量和数学推理准确性有专业判断。',
      common_tools: 'Cursor为主力工具，Claude Code处理复杂ML逻辑。',
      prompt_example: '用PyTorch实现自注意力机制，需支持多头注意力和掩码，附完整的前向传播测试。',
      self_evaluation: '数学推理能力强，能精准识别AI在数值计算和算法逻辑上的错误。'
    },
    created_at: '2024-06-15', updated_at: '2026-05-10'
  },
  {
    id: 'e014', name: '林美玲', phone: '13800100014',
    education: '本科', work_years: 6, industry: '电商', profession: '运营总监',
    scenes: ['通用'], tools: ['ChatGPT', 'Kimi', 'Claude'],
    daily_hours: 1.5, response_speed: '中', level: 'A',
    total_score: 72, avg_score: 69, bonus_score: 5, task_count: 4,
    status: 'active',
    ability_qa: {
      llm_experience: '用AI做内容策划、文案撰写和数据报告，对通用语言任务有丰富评估经验。',
      common_tools: 'ChatGPT做创意文案，Kimi处理长文档，Claude用于深度分析。',
      prompt_example: '为双十一活动设计10条不同风格的推广文案，需包含情感共鸣、功能强调、价格刺激三类。',
      self_evaluation: '语言感知力强，善于评估AI输出的创意性和语言自然度。'
    },
    created_at: '2024-08-01', updated_at: '2026-02-28'
  },
  {
    id: 'e015', name: '徐大为', phone: '13800100015',
    education: '硕士', work_years: 7, industry: '咨询', profession: '技术咨询顾问',
    scenes: ['Agent', '通用'], tools: ['GPT-4', 'Claude', 'Perplexity'],
    daily_hours: 2, response_speed: '中', level: 'A',
    total_score: 77, avg_score: 74, bonus_score: 5, task_count: 5,
    status: 'active',
    ability_qa: {
      llm_experience: '为客户评估AI工具落地方案，有系统化的多维度评估框架和实践经验。',
      common_tools: 'GPT-4为主，Claude做分析，Perplexity做研究。',
      prompt_example: '为一家制造企业设计AI转型路线图，包括优先级、预期ROI和风险评估，以顾问报告形式输出。',
      self_evaluation: '系统性强，能从多角度评估AI输出的合理性，擅长发现方案中的逻辑漏洞。'
    },
    created_at: '2024-09-01', updated_at: '2026-04-01'
  },
  {
    id: 'e016', name: '胡文娟', phone: '13800100016',
    education: '硕士', work_years: 4, industry: '医疗', profession: '临床数据分析师',
    scenes: ['通用', 'Coding'], tools: ['ChatGPT', 'Claude', 'GitHub Copilot'],
    daily_hours: 2, response_speed: '快', level: 'A',
    total_score: 79, avg_score: 76, bonus_score: 5, task_count: 5,
    status: 'active',
    ability_qa: {
      llm_experience: '用AI辅助医学统计分析和报告，对输出的准确性和专业性有严格要求。',
      common_tools: 'Claude用于医学文献分析，ChatGPT辅助统计解释，GitHub Copilot写R/Python。',
      prompt_example: '分析临床试验数据，解释KM曲线和Log-rank检验结果，用通俗语言向非专业人员说明。',
      self_evaluation: '专业知识深厚，能识别AI在医学领域的专业性错误和不当建议。'
    },
    created_at: '2024-10-01', updated_at: '2026-03-20'
  },
  {
    id: 'e017', name: '许志远', phone: '13800100017',
    education: '本科', work_years: 9, industry: '互联网', profession: '全栈工程师',
    scenes: ['Coding', 'Agent'], tools: ['Cursor', 'Claude Code', 'ChatGPT', 'v0'],
    daily_hours: 4, response_speed: '快', level: 'A',
    total_score: 81, avg_score: 79, bonus_score: 0, task_count: 4,
    status: 'frozen',
    ability_qa: {
      llm_experience: '全栈开发深度使用AI，前后端均有大量实践，对工程完整性评估能力强。',
      common_tools: 'Cursor写后端，v0做前端原型，Claude Code处理复杂逻辑。',
      prompt_example: '设计并实现一个实时协作文档系统，支持多人同时编辑、冲突解决和历史版本，给出技术选型和核心代码。',
      self_evaluation: '工程实践经验丰富，能快速判断AI给出方案的可行性和完整性。'
    },
    created_at: '2024-02-20', updated_at: '2026-01-05'
  },
  {
    id: 'e018', name: '高晨曦', phone: '13800100018',
    education: '硕士', work_years: 5, industry: '物联网', profession: '嵌入式工程师',
    scenes: ['Coding'], tools: ['Cursor', 'ChatGPT', 'GitHub Copilot'],
    daily_hours: 3, response_speed: '中', level: 'A',
    total_score: 74, avg_score: 71, bonus_score: 5, task_count: 5,
    status: 'active',
    ability_qa: {
      llm_experience: '嵌入式开发中使用AI辅助驱动代码和协议实现，对底层代码准确性有高要求。',
      common_tools: 'Cursor为主，ChatGPT用于协议文档理解。',
      prompt_example: '用C实现I2C通信协议的软件模拟，需支持多从机、错误检测和时序精确控制。',
      self_evaluation: '底层代码能力强，能发现AI在硬件相关代码中的错误和不安全操作。'
    },
    created_at: '2024-07-15', updated_at: '2026-02-10'
  },
  {
    id: 'e019', name: '马丽娜', phone: '13800100019',
    education: '本科', work_years: 6, industry: '金融', profession: '量化分析师',
    scenes: ['Coding', 'Agent'], tools: ['ChatGPT', 'Claude', 'GitHub Copilot'],
    daily_hours: 2, response_speed: '快', level: 'A',
    total_score: 76, avg_score: 74, bonus_score: 0, task_count: 3,
    status: 'active',
    ability_qa: {
      llm_experience: '量化策略开发中使用AI辅助，对数学精确性和数据处理逻辑的评估能力强。',
      common_tools: 'ChatGPT辅助策略设计，Claude做文档分析，GitHub Copilot写量化代码。',
      prompt_example: '实现一个基于动量因子的多因子选股策略，需包含因子标准化、组合优化和回测框架。',
      self_evaluation: '数学能力强，对AI的数值计算和金融逻辑错误识别准确，注重结果可验证性。'
    },
    created_at: '2024-11-01', updated_at: '2026-04-15'
  },
  {
    id: 'e020', name: '谢俊杰', phone: '13800100020',
    education: '硕士', work_years: 4, industry: '互联网', profession: 'DevOps工程师',
    scenes: ['Coding', 'Agent'], tools: ['Cursor', 'Claude Code', 'ChatGPT'],
    daily_hours: 3, response_speed: '快', level: 'A',
    total_score: 73, avg_score: 70, bonus_score: 5, task_count: 4,
    status: 'active',
    ability_qa: {
      llm_experience: '基础设施自动化中深度使用AI，对运维脚本和配置管理的准确性有高要求。',
      common_tools: 'Cursor写基础设施代码，Claude Code做复杂脚本，ChatGPT辅助文档。',
      prompt_example: '设计一套基于Kubernetes的零停机部署方案，包括灰度发布、回滚策略和监控告警配置。',
      self_evaluation: '运维视角独特，能发现AI方案中的可靠性和运维复杂度问题。'
    },
    created_at: '2024-08-20', updated_at: '2026-05-08'
  },

  // ── B 级（12人）──────────────────────────────────────────
  {
    id: 'e021', name: '程晓燕', phone: '13800100021',
    education: '本科', work_years: 3, industry: '互联网', profession: '前端开发',
    scenes: ['Coding'], tools: ['Cursor', 'ChatGPT'],
    daily_hours: 3, response_speed: '中', level: 'B',
    total_score: 65, avg_score: 63, bonus_score: 0, task_count: 3,
    status: 'active',
    ability_qa: {
      llm_experience: '日常前端开发使用AI辅助，有一定的代码质量判断能力，但深度有限。',
      common_tools: 'Cursor为主，ChatGPT解答问题。',
      prompt_example: '实现一个响应式导航栏，支持移动端汉堡菜单，纯CSS动画，无需JS库。',
      self_evaluation: '熟悉常见前端场景，对UI代码有一定判断力，但对复杂架构评估经验不足。'
    },
    created_at: '2024-09-15', updated_at: '2026-03-01'
  },
  {
    id: 'e022', name: '钱磊', phone: '13800100022',
    education: '本科', work_years: 4, industry: '游戏', profession: '运营专员',
    scenes: ['通用'], tools: ['ChatGPT', 'Kimi'],
    daily_hours: 2, response_speed: '中', level: 'B',
    total_score: 62, avg_score: 60, bonus_score: 0, task_count: 2,
    status: 'active',
    ability_qa: {
      llm_experience: '用AI做游戏运营内容，有基础的AI文本质量评估能力。',
      common_tools: 'ChatGPT做运营文案，Kimi处理长内容。',
      prompt_example: '为手游写一个版本更新公告，突出新英雄技能，语气热情，适合年轻玩家。',
      self_evaluation: '运营内容评估有一定经验，但技术类任务评估能力有限。'
    },
    created_at: '2024-10-10', updated_at: '2026-01-20'
  },
  {
    id: 'e023', name: '孟凡', phone: '13800100023',
    education: '硕士', work_years: 2, industry: '互联网', profession: '测试工程师',
    scenes: ['Coding', 'Agent'], tools: ['ChatGPT', 'Cursor'],
    daily_hours: 2, response_speed: '快', level: 'B',
    total_score: 67, avg_score: 65, bonus_score: 0, task_count: 3,
    status: 'active',
    ability_qa: {
      llm_experience: '用AI辅助测试用例生成，有基础代码质量判断能力，测试角度看AI输出有优势。',
      common_tools: 'ChatGPT生成测试用例，Cursor写测试代码。',
      prompt_example: '为登录功能设计完整测试用例，覆盖正常流程、边界条件、安全测试，用Gherkin格式输出。',
      self_evaluation: '测试思维强，能发现AI生成代码中遗漏的边界条件，但架构设计评估经验少。'
    },
    created_at: '2024-11-15', updated_at: '2026-02-15'
  },
  {
    id: 'e024', name: '卢静', phone: '13800100024',
    education: '本科', work_years: 5, industry: '物流', profession: '系统分析师',
    scenes: ['通用', 'Coding'], tools: ['ChatGPT', 'GitHub Copilot'],
    daily_hours: 2, response_speed: '中', level: 'B',
    total_score: 60, avg_score: 58, bonus_score: 0, task_count: 2,
    status: 'active',
    ability_qa: {
      llm_experience: '用AI辅助需求分析和文档编写，代码能力一般，文档类任务评估有经验。',
      common_tools: 'ChatGPT做需求文档，GitHub Copilot辅助简单代码。',
      prompt_example: '将以下混乱的业务需求整理成标准用户故事格式，识别缺失的验收条件。',
      self_evaluation: '文档和逻辑分析有一定能力，代码深度评估为弱项。'
    },
    created_at: '2024-12-01', updated_at: '2026-01-10'
  },
  {
    id: 'e025', name: '邓文博', phone: '13800100025',
    education: '本科', work_years: 3, industry: '互联网', profession: 'Python开发',
    scenes: ['Coding'], tools: ['Cursor', 'ChatGPT', 'GitHub Copilot'],
    daily_hours: 3, response_speed: '快', level: 'B',
    total_score: 64, avg_score: 62, bonus_score: 0, task_count: 3,
    status: 'active',
    ability_qa: {
      llm_experience: '用AI辅助Python后端开发，有一定代码评估能力，专注度够但广度不足。',
      common_tools: 'Cursor为主，GitHub Copilot补全。',
      prompt_example: '用FastAPI实现JWT认证中间件，支持token刷新和黑名单机制。',
      self_evaluation: 'Python代码质量把握较好，对其他语言和架构评估能力有限。'
    },
    created_at: '2025-01-05', updated_at: '2026-03-25'
  },
  {
    id: 'e026', name: '叶青', phone: '13800100026',
    education: '硕士', work_years: 6, industry: '教育', profession: '课程设计师',
    scenes: ['通用'], tools: ['Claude', 'ChatGPT', 'Notion AI'],
    daily_hours: 1.5, response_speed: '慢', level: 'B',
    total_score: 63, avg_score: 61, bonus_score: 0, task_count: 2,
    status: 'active',
    ability_qa: {
      llm_experience: '用AI辅助课程内容创作，对教育类文本质量有专业判断，技术评估能力弱。',
      common_tools: 'Claude做深度内容，ChatGPT创意发散，Notion AI组织内容。',
      prompt_example: '设计一个高中生学习Python的6周课程大纲，需考虑认知负荷渐进，附每周学习目标。',
      self_evaluation: '教育内容质量把握准确，但缺乏技术背景，复杂技术任务评估困难。'
    },
    created_at: '2025-01-20', updated_at: '2026-02-05'
  },
  {
    id: 'e027', name: '潘宇', phone: '13800100027',
    education: '本科', work_years: 4, industry: '金融', profession: '风控分析师',
    scenes: ['通用', 'Coding'], tools: ['ChatGPT', 'Claude'],
    daily_hours: 2, response_speed: '中', level: 'B',
    total_score: 66, avg_score: 64, bonus_score: 0, task_count: 2,
    status: 'active',
    ability_qa: {
      llm_experience: '风控建模中使用AI，对数据分析和逻辑推理的评估有一定基础。',
      common_tools: 'ChatGPT做模型解释，Claude做文档分析。',
      prompt_example: '分析信用评分模型的特征重要性，用通俗语言解释为什么某客户被拒贷，注意合规表述。',
      self_evaluation: '金融逻辑判断较强，AI技术深度评估为弱项。'
    },
    created_at: '2025-02-01', updated_at: '2026-04-20'
  },
  {
    id: 'e028', name: '蒋倩倩', phone: '13800100028',
    education: '本科', work_years: 2, industry: '互联网', profession: '产品经理（初级）',
    scenes: ['通用', 'Agent'], tools: ['ChatGPT', 'Kimi', 'Claude'],
    daily_hours: 2, response_speed: '快', level: 'B',
    total_score: 61, avg_score: 59, bonus_score: 0, task_count: 2,
    status: 'active',
    ability_qa: {
      llm_experience: '产品实习和初级PM阶段使用AI辅助，有基础的文本质量和逻辑评估能力。',
      common_tools: 'ChatGPT写PRD初稿，Kimi处理竞品报告，Claude深度分析。',
      prompt_example: '为一个拼车App设计用户评价体系，防止刷好评，保护双方隐私，给出完整机制设计。',
      self_evaluation: '产品思维初步形成，对AI输出的逻辑性有判断，但专业深度不足。'
    },
    created_at: '2025-03-01', updated_at: '2026-03-15'
  },
  {
    id: 'e029', name: '魏峰', phone: '13800100029',
    education: '本科', work_years: 7, industry: '传统制造', profession: 'IT工程师',
    scenes: ['Coding'], tools: ['ChatGPT', 'GitHub Copilot'],
    daily_hours: 2, response_speed: '慢', level: 'B',
    total_score: 58, avg_score: 56, bonus_score: 0, task_count: 2,
    status: 'active',
    ability_qa: {
      llm_experience: '传统行业IT系统维护中初步使用AI，代码能力中等，评估角度较为基础。',
      common_tools: 'ChatGPT解决技术问题，GitHub Copilot辅助Java代码。',
      prompt_example: '将老旧的Java EE单体应用逐步迁移到Spring Boot微服务，给出迁移顺序和风险控制。',
      self_evaluation: '工程经验丰富但AI使用较浅，实用性判断强，先进技术评估能力弱。'
    },
    created_at: '2025-02-15', updated_at: '2026-01-30'
  },
  {
    id: 'e030', name: '苏晓磊', phone: '13800100030',
    education: '本科', work_years: 3, industry: '教育科技', profession: '内容运营',
    scenes: ['通用'], tools: ['ChatGPT', 'Notion AI'],
    daily_hours: 2, response_speed: '中', level: 'B',
    total_score: 59, avg_score: 57, bonus_score: 0, task_count: 2,
    status: 'active',
    ability_qa: {
      llm_experience: '内容生产中使用AI，对文字质量有感知，技术类评估能力有限。',
      common_tools: 'ChatGPT内容辅助，Notion AI组织素材。',
      prompt_example: '用讲故事的方式解释量子纠缠，适合初中生理解，避免数学公式。',
      self_evaluation: '文字感强，内容逻辑评估有一定能力，技术代码评估为明显弱项。'
    },
    created_at: '2025-03-10', updated_at: '2026-02-20'
  },
  {
    id: 'e031', name: '薛磊', phone: '13800100031',
    education: '硕士', work_years: 5, industry: '互联网', profession: '数据工程师',
    scenes: ['Coding', 'Agent'], tools: ['Cursor', 'ChatGPT', 'Claude'],
    daily_hours: 3, response_speed: '中', level: 'B',
    total_score: 68, avg_score: 66, bonus_score: 0, task_count: 3,
    status: 'active',
    ability_qa: {
      llm_experience: '数据管道开发中使用AI，SQL和Python评估能力较强，但Agent任务经验有限。',
      common_tools: 'Cursor写ETL代码，ChatGPT辅助SQL优化。',
      prompt_example: '设计一个处理10亿行日志的Spark ETL流程，需要幂等性、错误恢复和性能监控。',
      self_evaluation: '数据工程视角有独特优势，大规模数据处理代码评估准确，但通用任务一般。'
    },
    created_at: '2025-01-25', updated_at: '2026-04-10'
  },
  {
    id: 'e032', name: '曹悦', phone: '13800100032',
    education: '本科', work_years: 4, industry: '零售', profession: 'BI分析师',
    scenes: ['通用', 'Coding'], tools: ['ChatGPT', 'Claude', 'GitHub Copilot'],
    daily_hours: 2, response_speed: '中', level: 'B',
    total_score: 56, avg_score: 54, bonus_score: 0, task_count: 2,
    status: 'active',
    ability_qa: {
      llm_experience: '商业分析中使用AI，SQL和数据可视化辅助，对分析逻辑评估有经验。',
      common_tools: 'ChatGPT做分析思路，Claude整理报告，GitHub Copilot写SQL。',
      prompt_example: '分析零售商品的交叉销售机会，用关联规则挖掘，给出可操作的货架陈列建议。',
      self_evaluation: '数据分析视角清晰，但AI技术深度评估不足，容易被看似合理的错误输出欺骗。'
    },
    created_at: '2025-04-01', updated_at: '2026-03-05'
  },

  // ── C 级（5人）──────────────────────────────────────────
  {
    id: 'e033', name: '侯兵', phone: '13800100033',
    education: '大专', work_years: 2, industry: '互联网', profession: '初级开发',
    scenes: ['Coding'], tools: ['ChatGPT'],
    daily_hours: 2, response_speed: '慢', level: 'C',
    total_score: 48, avg_score: 48, bonus_score: 0, task_count: 2,
    status: 'active',
    ability_qa: {
      llm_experience: 'ChatGPT辅助日常编码，使用时间较短，评估能力基础。',
      common_tools: 'ChatGPT解决bug。',
      prompt_example: '写一个Python脚本读取CSV文件并输出统计信息。',
      self_evaluation: '基础代码能力，对复杂任务评估有困难。'
    },
    created_at: '2025-04-15', updated_at: '2026-02-01'
  },
  {
    id: 'e034', name: '石晓燕', phone: '13800100034',
    education: '本科', work_years: 1, industry: '广告', profession: '文案专员',
    scenes: ['通用'], tools: ['ChatGPT', 'Kimi'],
    daily_hours: 1, response_speed: '慢', level: 'C',
    total_score: 42, avg_score: 42, bonus_score: 0, task_count: 2,
    status: 'active',
    ability_qa: {
      llm_experience: '职场初期使用AI辅助文案，评估标准不够系统，易受表面质量影响。',
      common_tools: 'ChatGPT写文案，Kimi读长文。',
      prompt_example: '写一条朋友圈广告推广减肥产品，语气轻松，不要太夸张。',
      self_evaluation: '文案感觉有但标准模糊，技术评估完全不擅长。'
    },
    created_at: '2025-05-01', updated_at: '2026-01-15'
  },
  {
    id: 'e035', name: '牛强', phone: '13800100035',
    education: '大专', work_years: 3, industry: '物流', profession: '系统操作员',
    scenes: ['通用'], tools: ['ChatGPT'],
    daily_hours: 1, response_speed: '慢', level: 'C',
    total_score: 45, avg_score: 45, bonus_score: 0, task_count: 1,
    status: 'active',
    ability_qa: {
      llm_experience: '工作中偶尔使用ChatGPT，AI使用深度有限，评估体系尚未建立。',
      common_tools: 'ChatGPT解答操作问题。',
      prompt_example: '帮我写一封申请加班费的邮件。',
      self_evaluation: '对AI使用较浅，能力评估主要靠直觉。'
    },
    created_at: '2025-05-20', updated_at: '2025-12-20'
  },
  {
    id: 'e036', name: '白晓云', phone: '13800100036',
    education: '本科', work_years: 2, industry: '教育', profession: '助教',
    scenes: ['通用'], tools: ['ChatGPT', 'Claude'],
    daily_hours: 1.5, response_speed: '中', level: 'C',
    total_score: 50, avg_score: 50, bonus_score: 0, task_count: 1,
    status: 'active',
    ability_qa: {
      llm_experience: '教学辅助中使用AI，但评估标准不够专业，受主观印象影响大。',
      common_tools: 'ChatGPT备课，Claude批改作业参考。',
      prompt_example: '给小学生解释分数的概念，用生活中的例子，5分钟能讲完。',
      self_evaluation: '基础语言评估有一定能力，但专业评估标准欠缺。'
    },
    created_at: '2025-06-01', updated_at: '2026-01-05'
  },
  {
    id: 'e037', name: '洪军', phone: '13800100037',
    education: '本科', work_years: 5, industry: '制造', profession: '生产主管',
    scenes: ['通用'], tools: ['ChatGPT'],
    daily_hours: 0.5, response_speed: '慢', level: 'C',
    total_score: 44, avg_score: 44, bonus_score: 0, task_count: 1,
    status: 'frozen',
    ability_qa: {
      llm_experience: '初步接触AI工具，主要用于简单查询，评估深度有限。',
      common_tools: 'ChatGPT偶尔使用。',
      prompt_example: '帮我优化一下这段生产报告的表达。',
      self_evaluation: 'AI使用经验少，评估能力主要靠常识。'
    },
    created_at: '2025-06-15', updated_at: '2025-11-30'
  },

  // ── 未评级（3人）──────────────────────────────────────────
  {
    id: 'e038', name: '秦子豪', phone: '13800100038',
    education: '硕士', work_years: 3, industry: '互联网', profession: '算法工程师',
    scenes: ['Coding', 'Agent'], tools: ['Cursor', 'Claude Code', 'ChatGPT'],
    daily_hours: 4, response_speed: '快', level: '未评级',
    total_score: 0, avg_score: 0, bonus_score: 0, task_count: 0,
    status: 'active',
    ability_qa: {
      llm_experience: '日常工作大量使用AI编程辅助，对代码生成质量有较强判断力，期待参与正式评测。',
      common_tools: 'Cursor每日必用，Claude Code处理复杂任务，ChatGPT做快速原型。',
      prompt_example: '实现一个高效的并发任务调度器，支持优先级、依赖关系和超时取消，用Python asyncio。',
      self_evaluation: '技术能力强，评估标准清晰，愿意投入充足时间确保评测质量。'
    },
    created_at: '2026-04-01', updated_at: '2026-04-01'
  },
  {
    id: 'e039', name: '夏冰', phone: '13800100039',
    education: '本科', work_years: 6, industry: '电商', profession: '用户研究员',
    scenes: ['通用', 'Agent'], tools: ['Claude', 'ChatGPT', 'Perplexity'],
    daily_hours: 2, response_speed: '中', level: '未评级',
    total_score: 0, avg_score: 0, bonus_score: 0, task_count: 0,
    status: 'active',
    ability_qa: {
      llm_experience: '用户研究中深度使用AI辅助访谈分析和报告撰写，对AI理解用户意图的能力有专业判断。',
      common_tools: 'Claude做深度文本分析，ChatGPT辅助报告，Perplexity做市场研究。',
      prompt_example: '分析20份用户访谈文本，提取主要痛点、期望和使用场景，用亲和图法组织，给出设计机会点。',
      self_evaluation: '用户洞察能力强，对AI理解人类需求的准确性有敏锐感知，期待贡献评测视角。'
    },
    created_at: '2026-04-15', updated_at: '2026-04-15'
  },
  {
    id: 'e040', name: '廖凯', phone: '13800100040',
    education: '硕士', work_years: 4, industry: '云计算', profession: '云原生工程师',
    scenes: ['Coding', 'Agent'], tools: ['Cursor', 'Claude Code', 'GitHub Copilot'],
    daily_hours: 3, response_speed: '快', level: '未评级',
    total_score: 0, avg_score: 0, bonus_score: 0, task_count: 0,
    status: 'active',
    ability_qa: {
      llm_experience: 'Kubernetes和云原生开发中大量使用AI，对基础设施代码和运维脚本的质量评估有实战积累。',
      common_tools: 'Cursor写云原生代码，Claude Code处理复杂架构，GitHub Copilot日常补全。',
      prompt_example: '设计一个多云容灾方案，在AWS和阿里云之间实现秒级故障切换，给出架构图和关键配置。',
      self_evaluation: '云原生视角独特，对AI在基础设施领域的理解深度有准确判断，新人但有信心。'
    },
    created_at: '2026-05-01', updated_at: '2026-05-01'
  },
];
