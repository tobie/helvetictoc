require 'rubygems'
require 'rake'
require 'modulr'
require 'erb'

task :build do
  mkdir_p('js')
  js = Modulr.ize(File.join('src', 'program.js'), { :sync => true })
  File.open(File.join('js', 'main.js'), 'w') { |f| f << js }
  puts "JS output size: " + js.length.to_s
end