to start dev server
run: npm run start


in order to access session, add this to
root.web/Caddyfile.dockerforwindows

route /newapp/* {
	uri strip_prefix /newapp
	reverse_proxy http://host.docker.internal:7999
}

then, once logged in to localsymmetry.net, go to

https://localsymmetry.net/newapp/