const { executeQuery, executePaginatedQuery } = require('../../utils/common')

// 输入验证函数
const validatePagination = (page, pageSize) => {
    if (page < 0 || pageSize <= 0 || pageSize > 100) {
        throw new Error('分页参数无效');
    }
};

const validateId = (id) => {
    if (!id || !Number.isInteger(Number(id)) || Number(id) <= 0) {
        throw new Error('ID参数无效');
    }
};

const validateName = (name) => {
    if (!name || typeof name !== 'string' || name.trim().length === 0) {
        throw new Error('名称参数无效');
    }
};

const validateStringField = (field, fieldName, required = false) => {
    if (required && (!field || typeof field !== 'string' || field.trim().length === 0)) {
        throw new Error(`${fieldName}参数无效`);
    }
    if (field !== undefined && (typeof field !== 'string')) {
        throw new Error(`${fieldName}参数类型无效`);
    }
};

module.exports = {
    // 获取模板列表（分页）
    friend: async ({ page = 0, pageSize = 10 }) => {
        try {
            // 确保参数是数字类型
            const pageNum = parseInt(page, 10) || 0;
            const pageSizeNum = parseInt(pageSize, 10) || 10;
            
            validatePagination(pageNum, pageSizeNum);
            
            const sql = 'SELECT id, name, phone, wechat, city, occupation FROM friend LIMIT ? OFFSET ?';
            const countSql = 'SELECT COUNT(*) as counts FROM friend';
            const values = [pageSizeNum, pageNum * pageSizeNum];

            console.log('执行分页查询:', { 
                sql, 
                values, 
                valueTypes: values.map(v => typeof v),
                countSql 
            });
            
            return await executePaginatedQuery(sql, countSql, values);
        } catch (error) {
            console.error('获取模板列表失败:', error.message);
            throw error;
        }
    }, 
    // 根据ID获取模板
    friendGet: async ({ id }) => {
        try {
            validateId(id);
            
            const sql = 'SELECT id, name, phone, wechat, city, occupation FROM friend WHERE id = ?';
            const values = [id];

            console.log('根据ID查询模板:', { sql, values });
            
            const results = await executeQuery(sql, values);
            
            if (results.length === 0) {
                throw new Error(`ID为 ${id} 的模板不存在`);
            }
            
            return results[0];
        } catch (error) {
            console.error('获取模板失败:', error.message);
            throw error;
        }
    },

    // 搜索模板（分页）
    friendSearch: async ({ page = 0, pageSize = 10, data = {} }) => {
        try {
            validatePagination(page, pageSize);
            
            const { keyword } = data;
            const values = [];
            const countValues = [];
            
            let whereSql = '';
            if (keyword && keyword.trim() !== '') {
                whereSql += ' AND (name LIKE ? OR phone LIKE ? OR wechat LIKE ? OR city LIKE ? OR occupation LIKE ?)';
                const keywordPattern = `%${keyword.trim()}%`;
                values.push(keywordPattern, keywordPattern, keywordPattern, keywordPattern, keywordPattern);
                countValues.push(keywordPattern, keywordPattern, keywordPattern, keywordPattern, keywordPattern);
            }

            const sql = `SELECT id, name, phone, wechat, city, occupation FROM friend WHERE 1=1${whereSql} LIMIT ? OFFSET ?`;
            const countSql = `SELECT COUNT(*) as counts FROM friend WHERE 1=1${whereSql}`;
            
            values.push(pageSize, page * pageSize);
            
            console.log('搜索模板:', { sql, values, countSql, countValues });
            
            return await executePaginatedQuery(sql, countSql, values, countValues);
        } catch (error) {
            console.error('搜索模板失败:', error.message);
            throw error;
        }
    },

    // 添加模板
    friendAdd: async ({ data }) => {
        try {
            const { name, phone, wechat, city, occupation } = data || {};
            validateName(name);
            validateStringField(phone, '电话');
            validateStringField(wechat, '微信');
            validateStringField(city, '城市');
            validateStringField(occupation, '职业');
            
            const sql = 'INSERT INTO friend (name, phone, wechat, city, occupation) VALUES (?, ?, ?, ?, ?)';
            const values = [
                name.trim(), 
                phone || '', 
                wechat || '', 
                city || '', 
                occupation || ''
            ];
            
            console.log('添加模板:', { sql, values });
            
            const results = await executeQuery(sql, values);
            return results.insertId;
        } catch (error) {
            console.error('添加模板失败:', error.message);
            throw error;
        }
    },

    // 批量添加模板
    friendBatchAdd: async ({ datas }) => {
        try {
            if (!Array.isArray(datas) || datas.length === 0) {
                throw new Error('批量添加数据不能为空');
            }
            
            // 验证所有数据
            const values = datas.map(item => {
                const { name, phone, wechat, city, occupation } = item || {};
                validateName(name);
                validateStringField(phone, '电话');
                validateStringField(wechat, '微信');
                validateStringField(city, '城市');
                validateStringField(occupation, '职业');
                
                return [
                    name.trim(),
                    phone || '',
                    wechat || '',
                    city || '',
                    occupation || ''
                ];
            });
            
            const placeholders = values.map(() => '(?, ?, ?, ?, ?)').join(',');
            const sql = `INSERT INTO friend (name, phone, wechat, city, occupation) VALUES ${placeholders}`;
            
            // 将二维数组展平为一维数组
            const flatValues = values.flat();
            
            console.log('批量添加模板:', { sql, values: flatValues });
            
            const results = await executeQuery(sql, flatValues);
            return results.insertId;
        } catch (error) {
            console.error('批量添加模板失败:', error.message);
            throw error;
        }
    },

    // 更新模板
    friendUpdate: async ({ id, data }) => {
        try {
            validateId(id);
            const { name, phone, wechat, city, occupation } = data || {};
            
            if (!name && phone === undefined && wechat === undefined && city === undefined && occupation === undefined) {
                throw new Error('更新数据不能为空');
            }
            
            validateName(name);
            validateStringField(phone, '电话');
            validateStringField(wechat, '微信');
            validateStringField(city, '城市');
            validateStringField(occupation, '职业');
            
            const sql = 'UPDATE friend SET name = ?, phone = ?, wechat = ?, city = ?, occupation = ? WHERE id = ?';
            const values = [
                name.trim(), 
                phone || '', 
                wechat || '', 
                city || '', 
                occupation || '', 
                id
            ];
            
            console.log('更新模板:', { sql, values });
            
            const results = await executeQuery(sql, values);
            
            if (results.affectedRows === 0) {
                throw new Error(`ID为 ${id} 的模板不存在`);
            }
            
            return true;
        } catch (error) {
            console.error('更新模板失败:', error.message);
            throw error;
        }
    },

    // 删除模板
    friendDelete: async ({ id }) => {
        try {
            validateId(id);
            
            const sql = 'DELETE FROM friend WHERE id = ?';
            const values = [id];
            
            console.log('删除模板:', { sql, values });
            
            const results = await executeQuery(sql, values);
            
            if (results.affectedRows === 0) {
                throw new Error(`ID为 ${id} 的模板不存在`);
            }
            
            return true;
        } catch (error) {
            console.error('删除模板失败:', error.message);
            throw error;
        }
    },

    // 批量删除模板
    friendBatchDelete: async ({ ids }) => {
        try {
            if (!Array.isArray(ids) || ids.length === 0) {
                throw new Error('批量删除的ID列表不能为空');
            }
            
            // 验证所有ID
            ids.forEach(id => validateId(id));
            
            const placeholders = ids.map(() => '?').join(',');
            const sql = `DELETE FROM friend WHERE id IN (${placeholders})`;
            
            console.log('批量删除模板:', { sql, values: ids });
            
            const results = await executeQuery(sql, ids);
            
            if (results.affectedRows === 0) {
                throw new Error('没有找到要删除的模板');
            }
            
            return true;
        } catch (error) {
            console.error('批量删除模板失败:', error.message);
            throw error;
        }
    }
}