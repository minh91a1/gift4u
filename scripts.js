const worldMap = document.getElementById('world_map');

const goLeftBtn = document.getElementById('go_left');
const goRightBtn = document.getElementById('go_right');
const goTopBtn = document.getElementById('go_top');
const goBottomBtn = document.getElementById('go_down');

const imgQuestion = document.getElementById('imgQuestion');
const videoQuestion = document.getElementById('videoQuestion');
const closeMultiQuestion = document.getElementById('closeMultimediaBtn');
const multimediaBoard = document.getElementById('multimediaBoard');

const mainThemeAudio = document.getElementById('mainThemeAudio');

var map = [
    [0, 0, 0, 0,10, 0, 0, 0],
    [0, 1, 0, 0, 0, 5, 0, 9],
    [0, 0, 2, 0, 4, 0, 8, 0],
    [0, 0,11, 3, 0, 7, 0, 0],
    [0, 0,12, 0, 0, 6, 0,99],
];


var questionElementMap = new Map();
var _currentQuestionId = -1;
var questionData = [
    {textContent:'dump', answer: 'X'},
    {textContent:'18 + 2 = ? \r\n\r\n A.20 __ B.22 __ C.24 __ D.32', answer: 'A', is18p: true},
    {textContent:'Hình nào dài hơn ? \r\n\r\n A.trên __ B.dưới __ C.bằng nhau __ D.chịu', answer: 'C', link: 'https://upload.wikimedia.org/wikipedia/commons/4/49/Jastrow-illusion-track.jpg', isImage: true},
    {textContent:'2 con vịt đi trước 2 con vịt, 2 con vịt đi sau 2 con vịt, 2 con vịt đi giữa 2 con. \r\nVậy có bao nhiêu con vịt? \r\n\r\n A.1 __ B.2 __ C.3 __ D.4', answer: 'D'},
    {textContent:'Hình nền windows 10 là sản phẩm của ? \r\n\r\n A.Photoshop __ B.Illustrator __ C.Lightroom __ D.Chụp trực tiếp', answer: 'D', link: 'https://anh.24h.com.vn/upload/2-2015/images/2015-06-27/1435416949-xsyvmicrosoft_reveals_the_official_windows_10_wallpaper_485311_4_gcua.jpg', isImage: true},
    {textContent:'Chữ này là chữ ? \r\n\r\n A.CHÚC __ B.MỪNG __ C.HẠNH __ D.PHÚC', answer: 'C', link: 'https://www.chunom.org/media/generated/5E78-300.png', isImage: true},
    {textContent:'Sở thú bị cháy, con gì chạy ra đầu tiên ? \r\n\r\n A.Con chim __ B.Con rắn __ C.Con nai __ D.Con cá', answer: 'C'},
    {textContent:'Ở Việt Nam có 5% số người sử dụng điện thoại không có tên trong danh bạ điện thoại. Nếu ta lấy ngẫu nhiên 100 người trong danh bạ thì trung bình sẽ có bao nhiêu người không có số điện thoại. ? \r\n\r\n A.0% __ B.5% __ C.95% __ D.100%', answer: 'A'},

    
    {textContent:'Cô bé ma đã không làm gì trong phim ? \r\n\r\n A.Nhảy nhót __ B.Xem phim __ C.Nhìn trộm __ D.Khóc lóc', answer: 'D', link: 'https://www.youtube.com/embed/byAfC5yW_hw?list=LLyX-k_sYI2JsBtWaayu_uGA', isVideo: true},
    
    {textContent:'Con mèo đã làm gì ở cuối video ? \r\n\r\n A.Đánh nhau __ B.Vuốt ve __ C.Nằm ngủ __ D.Đứng im', answer: 'A', link: 'https://www.youtube.com/embed/yNS7zzIzX-E', isVideo: true},
    
    {textContent:'Có bao nhiêu chấm đen ? \r\n\r\n A.4 __ B.8 __ C.12 __ D.16', answer: 'C', link:'http://i254.photobucket.com/albums/hh89/minh91a1/chamden.png', isImage:true},

    {textContent:'A và B màu nào đậm hơn ? \r\n\r\n A.A __ B.B __ C.Như nhau __ D.Chịu', answer: 'C', link:'http://blog.visme.co/wp-content/uploads/2017/01/Checker-shadow-illusion.png', isImage: true},
    {textContent:'Mèo tam thể là mèo ... ? \r\n\r\n A.đực __ B.cái __ C.tùy __ D.bê đê', answer: 'B'},

    {textContent:'Đâu không phải là vị ? \r\n\r\n A.Chua __ B.Cay __ C.Mặn __ D.Ngọt', answer: 'B'},
];

const avatar = document.getElementById('avatar');
const target = document.getElementById('target');

const questionContentElement = document.getElementById('questionContent');

const answerA = document.getElementById('answerABtn');
const answerB = document.getElementById('answerBBtn');
const answerC = document.getElementById('answerCBtn');
const answerD = document.getElementById('answerDBtn');

var ava_top = 0;
var ava_left = 0;
var walk_step = 4;
var can_move = true;

function playTheme() {
    if (mainThemeAudio.src.indexOf('.mp3') == -1 || mainThemeAudio.src == '')
        mainThemeAudio.src='./ANewDay-PederBHelland-5438208.mp3'
}
function stopTheme() {
    mainThemeAudio.src = 'none';
}

function closeAllMultimedia() {
    imgQuestion.style.visibility = 'hidden';
    imgQuestion.src = '';
    videoQuestion.style.visibility = 'hidden';
    videoQuestion.src = '';
    questionContentElement.textContent = '';
    closeMultiQuestion.style.visibility = 'hidden';
    multimediaBoard.style.visibility = 'hidden';
}

function triggerQuestion(id) {
    if (id == -1) {
        questionContentElement.textContent = "Sai rồi, không thể đi tiếp nữa";
        return;
    }
    if (id == 99) {
        questionContentElement.textContent = "Xin chúc mừng\r\nCảm ơn Hạnh đã dành thời gian chơi cái game cùi mía này.\r\n\
Chúc Hạnh 20-10 vẫn cứ xinh đẹp và vui vẻ như vậy nha.\r\n♪ ♪ ♪";
        playTheme();
        return;
    }

    if (id >= questionData.length) {
        return;
    }

    var data = questionData[id];

    if (data.is18p && !confirm('Câu hỏi có nội dung 18+. Bạn vẫn muốn tiếp tục ?')) {
        return;
    }

    if (data.isImage) {
        imgQuestion.src = data.link;
        imgQuestion.style.visibility = 'visible';
        closeMultiQuestion.style.visibility = 'visible';
        multimediaBoard.style.visibility = 'visible';
    }

    if (data.isVideo) {
        videoQuestion.src = data.link;
        videoQuestion.style.visibility = 'visible';
        closeMultiQuestion.style.visibility = 'visible';
        multimediaBoard.style.visibility = 'visible';
        stopTheme();
    }

    questionContentElement.textContent = data.textContent;
}

// =================
// MOVE CONTROL
// =================
const MOVE_DIRECTION = {
    TOP: 'top',
    LEFT: 'left',
    RIGHT: 'right',
    DOWN: 'down',
}
function moveAvatar(direction) {
    closeAllMultimedia();

    if ((ava_left == 0 && direction == MOVE_DIRECTION.LEFT) || 
        (ava_top == 0 && direction == MOVE_DIRECTION.TOP) ||
        (ava_left >= 28  && direction == MOVE_DIRECTION.RIGHT) || 
        (ava_top >= 16 && direction == MOVE_DIRECTION.DOWN)) {
        return;
    }

    var temp_top = ava_top;
    var temp_left = ava_left;

    switch (direction) {
        case MOVE_DIRECTION.TOP:
        temp_top -= walk_step;
        break;
        case MOVE_DIRECTION.LEFT:
        temp_left -= walk_step;
        break;
        case MOVE_DIRECTION.RIGHT:
        temp_left += walk_step;
        break;
        case MOVE_DIRECTION.DOWN:
        temp_top += walk_step;
        break;
    }

    var top_grid = temp_top / 4;
    var left_grid = temp_left / 4;

    if (map[top_grid][left_grid] != 0) {
        _currentQuestionId = map[top_grid][left_grid];
        triggerQuestion(map[top_grid][left_grid]);
        return;
    }

    _currentQuestionId = -1;
    questionContentElement.textContent = "";

    ava_top = temp_top;
    ava_left = temp_left;
    avatar.style.top = ava_top + 'rem';
    avatar.style.left = ava_left + 'rem';
}
goLeftBtn.addEventListener('click', function() {
    moveAvatar(MOVE_DIRECTION.LEFT);
});
goRightBtn.addEventListener('click', function() {
    moveAvatar(MOVE_DIRECTION.RIGHT);
});
goTopBtn.addEventListener('click', function() {
    moveAvatar(MOVE_DIRECTION.TOP);
});
goBottomBtn.addEventListener('click', function() {
    moveAvatar(MOVE_DIRECTION.DOWN);
});

// =================
// ANSWER
// =================
function answerQuestion(userAnswer) {
    closeAllMultimedia();
    if (_currentQuestionId == -1) {
        return;
    }

    var ele = questionElementMap.get(_currentQuestionId);
    var top = parseInt(ele.style.top);
    var left = parseInt(ele.style.left);
    ele.style.display = 'none';

    if (questionData[_currentQuestionId].answer == userAnswer) {
        map[top/4][left/4] = 0;
        questionContentElement.textContent = "Chúc mừng bạn đã trả lời đúng";
    } else {
        map[top/4][left/4] = -1;
        createWrong(top,left);
        questionContentElement.textContent = "Sai rồi, không thể đi tiếp nữa";
    }
    _currentQuestionId = -1;
}

answerA.addEventListener('click', function() {
    answerQuestion('A');
});
answerB.addEventListener('click', function() {
    answerQuestion('B');
});
answerC.addEventListener('click', function() {
    answerQuestion('C');
});
answerD.addEventListener('click', function() {
    answerQuestion('D');
});

closeMultiQuestion.addEventListener('click' , function() {
    closeAllMultimedia();
});

function createWrong(top,left) {
    var img = document.createElement('img');
    img.className = 'circleEntityNoAnimate';
    img.src = 'http://i254.photobucket.com/albums/hh89/minh91a1/wrong.png';
    img.style.top = top + 'rem';
    img.style.left = left + 'rem';
    worldMap.appendChild(img);
}

function createQuestion(top,left,id) {
    var img = document.createElement('img');
    img.id = 'question' + id;
    img.className = 'circleEntity';
    img.src = 'http://i254.photobucket.com/albums/hh89/minh91a1/question.png';
    img.style.top = top + 'rem';
    img.style.left = left + 'rem';
    worldMap.appendChild(img);

    questionElementMap.set(id, img);
}

function initQuestions() {
    for (var i = 0; i < 5; i++) {
        for (var j = 0; j < 8; j++) {
            if (map[i][j] != 0 && map[i][j] != 99) {
                createQuestion(i*4, j*4 ,map[i][j]);
            }
        }
    }
}

function init() {
    closeAllMultimedia();

    target.style.top = 16 + 'rem';
    target.style.left = 28 + 'rem';

    initQuestions();
    
    questionContentElement.textContent = "Xin chào! Hãy dùng các phím mũi tên bên dưới để di chuyển và vượt qua các câu hỏi để đến được với món quá nha!";
}

window.onload = init;
