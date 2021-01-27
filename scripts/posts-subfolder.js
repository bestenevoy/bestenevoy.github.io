// posts-subfolder
const { join } = require('path');
const { readdirSync } = require('fs');
const moment = require('moment');

// 使用子文件夹管理文章且不改变文章永久链接
// e.g. "source/_posts/2019/slug.md" => "https://hexo.example/slug/"
hexo.extend.filter.register('post_permalink', function (permalink) {
  // 想保留在文章永久链接中的子文件夹
  const excludes = [];

  const postDir = join(this.source_dir, '_posts');
  const folders = readdirSync(postDir, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name)
    .filter(dir => !excludes.includes(dir));

  for (const name of folders) {
    if (permalink.startsWith(`${name}/`)) {
      // 删除链接中的子文件夹名称
      return permalink.replace(`${name}/`, '');
    }
  }
});

// 使 `hexo new` 生成的文件保存至相应的年份子文件夹中
// @see hexo/lib/plugins/filter/new_post_path.js
hexo.extend.filter.register('new_post_path', data => {
  const year = moment(data.date || Date.now()).format('YYYY');
  data.path = join(year, data.slug);
  return data;
}, 1); // 设置为高优先级