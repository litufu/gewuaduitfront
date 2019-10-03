export const AUTH_TOKEN = 'auth-token'
export const roles = [
    { "name": "项目经理", "value": "MANAGER" },
    { "name": "项目合伙人", "value": "PARTNER" },
    { "name": "助理", "value": "ASSISTANT" },
    { "name": "质控人员", "value": "QC" },
    { "name": "复核合伙人", "value": "REVIEWPARTNER" },
    { "name": "集团主审", "value": "JUDGE" },
    { "name": "注册会计师", "value": "CPA" },
]
export const roleMatch = {
    "MANAGER": "项目经理",
    "PARTNER": "项目合伙人",
    "ASSISTANT": "助理",
    "QC": "质控人员",
    "REVIEWPARTNER": "复核合伙人",
    "JUDGE": "集团主审",
    "CPA": "注册会计师",
}
export const roleMatchReverse = {
    "项目经理": "MANAGER",
    "项目合伙人": "PARTNER",
    "助理": "ASSISTANT",
    "质控人员": "QC",
    "复核合伙人": "REVIEWPARTNER",
    "集团主审": "JUDGE",
    "注册会计师": "CPA",
}

export const checkExistSubjects = ["本年利润","未分配利润","以前年度损益调整"]