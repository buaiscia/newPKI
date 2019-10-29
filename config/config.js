var config = {};








// bash scripts

config.bash = {};
// config.bash.backup = 'long_ouputp.sh';
config.bash.path = '../scripts/';


// environments

config.env = {};
config.env.uat = {
    name: 'UAT',
    address: 'mob01-us32c9.us.infra'
};
config.env.uat2 = {
    name: 'UAT2',
    address: 'mob01-us32c8pk.us.infra'
}
config.env.prod = {
    name: 'PROD',
    address: 'mob01-pdcus1.us.prod'
};



module.exports = config;
