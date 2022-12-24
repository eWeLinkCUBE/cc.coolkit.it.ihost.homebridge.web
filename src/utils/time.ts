// 秒数格式化
export const formatSecondToMinute = (seconds: number) => {
    let m = Math.floor(seconds / 60);
    let s = seconds % 60;
    return `${m}min${s}s`;
};
