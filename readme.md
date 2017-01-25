# gulp-md-icons

scan templates - extract icon IDs - copy to specified directory - create config file


## Install

```
$ npm install --save-dev gulp-md-icons
```


## Usage

```js
var gulp = require('gulp');
var mdIcons = require('gulp-md-icons');

gulp.task('default', function () {
	return gulp.src(['src/**/*.html'])
		.pipe(mdIcons())
		.pipe(gulp.dest('dist'));
});
```


### mdIcons options

#### src

Type: `string`  
Default: `node_modules/material-design-icons`

Path to repo with material-design-icons (https://github.com/google/material-design-icons)

#### config.file

Type: `string`  

Path to file with configuration for icons.

#### config.iconsPath

Type: `string`

Relative path to icons directory 


```js
var gulp = require('gulp');
var mdIcons = require('gulp-md-icons');

gulp.task('default', function () {
	return gulp.src(['src/**/*.html'])
		.pipe(mdIcons({
			src: './icons-source',
			config: {
				file: './src/config/icons.js',
				iconsPath: '/assets'
			}
		}))
		.pipe(gulp.dest('./src/assets'));
});
```

## License

MIT © [Maciej Chmielarski](http://evenemento.co)
