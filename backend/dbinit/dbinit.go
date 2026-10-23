package dbinit

import (
	"fmt"
	"os"
	"path/filepath"

	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

const (
	DBFileName    = "app.db"
	ImagesDirName = "static/images"
)

var tableDDL = []string{
	`CREATE TABLE IF NOT EXISTS breeds (
		ID   INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
		Code TEXT    NOT NULL,
		Name TEXT    NOT NULL,
		Brief TEXT   NOT NULL
	)`,
	`CREATE TABLE IF NOT EXISTS history (
		id          INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
		img         TEXT    NOT NULL,
		breed       INTEGER NOT NULL,
		confidence  REAL    NOT NULL,
		date        INTEGER NOT NULL
	)`,
}

type Breed struct {
	ID    uint   `gorm:"primaryKey"`
	Code  string `gorm:"column:code"`
	Name  string `gorm:"column:name"`
	Brief string `gorm:"column:brief"`
}

var BreedSeeds = []Breed{
	{ID: 1, Code: "american_shorthair", Name: "美国短毛猫", Brief: "源自美国，是经典的“工作猫”，以健壮匀称的体格和短而浓密的被毛著称。性格温和、活泼且易于相处，对环境的适应能力很强。它们通常健康、长寿，是理想的家庭伴侣。"},
	{ID: 2, Code: "british_shorthair", Name: "英国短毛猫", Brief: "英国最古老的品种之一，最著名的特征是圆润的体型、浓密的绒毛和宽阔的脸庞。性格沉稳、安静且独立，不会过于粘人，但对主人十分忠诚。它们非常容易打理，适合喜欢安静陪伴的养猫人。"},
	{ID: 3, Code: "ragdoll", Name: "布偶猫", Brief: "由美国培育的大型长毛猫，性格极其温顺、忍耐力强，被抱起时会像布偶一样放松，因此得名。它们有着湛蓝的眼睛和柔软的被毛，对人类非常依赖，喜欢跟随主人，是典型的室内猫。"},
	{ID: 4, Code: "exotic_shorthair", Name: "异国短毛猫", Brief: "常被称为“加菲猫”，是波斯猫与美国短毛猫杂交培育出的品种。它们拥有波斯猫扁平的脸庞和圆滚滚的身体，但被毛是短而密的，打理起来比波斯猫省心得多。性格甜美、安静，喜欢悠闲地陪伴在主人身边。"},
	{ID: 5, Code: "maine_coon", Name: "缅因猫", Brief: "北美最古老的长毛猫品种，体型巨大，拥有浓密的被毛和像猞猁一样的耳毛。它们被称为“温柔的巨人”，性格友善、聪明，喜欢与人互动，甚至能像狗一样玩捡球游戏。需要一定的活动空间。"},
	{ID: 6, Code: "siamese", Name: "暹罗猫", Brief: "源自泰国（古称暹罗），是最著名的短毛猫品种之一。它们拥有修长的体型、独特的重点色（脸部、耳朵、四肢和尾巴颜色较深）和明亮的蓝色杏仁眼。性格非常外向、聪明且声音响亮，喜欢与人“对话”，需要较多的关注。"},
	{ID: 7, Code: "sphynx", Name: "斯芬克斯猫", Brief: "又称加拿大无毛猫，是基因突变产生的无毛品种。它们并非完全没有毛，而是覆盖着一层细小的绒毛，摸起来像温暖的麂皮。由于没有毛发保暖，它们新陈代谢快，食量较大，并且非常喜欢贴近人类取暖。性格活泼、好奇，像小丑一样爱表演。"},
	{ID: 8, Code: "turkish_van", Name: "土耳其梵猫", Brief: "源自土耳其梵湖地区，是一种半长毛猫。最独特的是它们全身大部分是白色，只有头部和尾巴有颜色，被称为“梵色”。它们以热爱游泳而闻名，被毛具有防水性。性格独立、聪明且精力旺盛。"},
	{ID: 9, Code: "bengal", Name: "孟加拉豹猫", Brief: "由亚洲豹猫与家猫杂交培育而成，拥有野性十足的金色或银色斑点被毛，体型矫健。它们性格自信、活泼、非常聪明，精力极其旺盛，需要大量的活动和攀爬空间。不适合没有经验或时间不足的养猫人。"},
	{ID: 10, Code: "abyssinian", Name: "阿比西尼亚猫", Brief: "阿比西尼亚猫外形优雅，短毛紧贴，毛色呈渐变光泽。性格活泼聪明，亲人好动，喜欢攀爬探索，被称为“像狗一样的猫”。精力旺盛，需充足玩具和活动空间，适合互动多、能陪伴的家庭。"},
	{ID: 11, Code: "none", Name: "非猫", Brief: "图为风景人物或其他物件！"},
	{ID: 12, Code: "other", Name: "非猫", Brief: "图为其他动物！"},
}

// ImagesDir 返回数据目录下的图片目录
func ImagesDir(dir string) string {
	return filepath.Join(dir, filepath.FromSlash(ImagesDirName))
}

// DBPath 返回数据目录下的数据库文件路径
func DBPath(dir string) string {
	return filepath.Join(dir, DBFileName)
}

// Init 在 dir 下准备数据库与图片目录，已存在的内容不会被覆盖：
//   - 创建 static/images 目录
//   - 创建 app.db 并建表（breeds / history）
//   - breeds 表为空时写入品种基础数据
func Init(dir string) error {
	if dir == "" {
		dir = "."
	}

	if err := os.MkdirAll(ImagesDir(dir), 0755); err != nil {
		return fmt.Errorf("create images dir: %w", err)
	}

	db, err := gorm.Open(sqlite.Open(DBPath(dir)), &gorm.Config{})
	if err != nil {
		return fmt.Errorf("open database: %w", err)
	}
	sqlDB, err := db.DB()
	if err != nil {
		return fmt.Errorf("open database: %w", err)
	}
	defer sqlDB.Close()

	for _, ddl := range tableDDL {
		if err := db.Exec(ddl).Error; err != nil {
			return fmt.Errorf("create table: %w", err)
		}
	}

	// 品种数据仅在缺失时补写
	var count int64
	if err := db.Table("breeds").Count(&count).Error; err != nil {
		return fmt.Errorf("count breeds: %w", err)
	}
	if count == 0 {
		for _, b := range BreedSeeds {
			if err := db.Create(&b).Error; err != nil {
				return fmt.Errorf("seed breed %s: %w", b.Code, err)
			}
		}
	}

	return nil
}
