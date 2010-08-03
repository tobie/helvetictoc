require 'rubygems'
require 'rake'
require 'modulr'
require 'erb'

task :build do
  mkdir_p('js')
  js = Modulr.ize(File.join('src', 'program.js'), { :sync => true })
  File.open(File.join('js', 'main.js'), 'w') { |f| f << js }
  js_size = js.length
  css_size = File.read(File.join('css', 'main.css')).length
  html_size = File.read('index.html').length
  puts "JS size: #{js_size}"
  puts "CSS size: #{css_size}"
  puts "HTML size: #{html_size}"
  puts "---------------------------"
  puts "TOTAL: #{ js_size + css_size + html_size  }"
end