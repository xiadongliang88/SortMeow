export namespace clause {
	
	export class Clause {
	    Name: string;
	    BeforeExpression: any;
	    AfterNameExpression: any;
	    AfterExpression: any;
	    Expression: any;
	
	    static createFrom(source: any = {}) {
	        return new Clause(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.Name = source["Name"];
	        this.BeforeExpression = source["BeforeExpression"];
	        this.AfterNameExpression = source["AfterNameExpression"];
	        this.AfterExpression = source["AfterExpression"];
	        this.Expression = source["Expression"];
	    }
	}
	export class Expr {
	    SQL: string;
	    Vars: any[];
	    WithoutParentheses: boolean;
	
	    static createFrom(source: any = {}) {
	        return new Expr(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.SQL = source["SQL"];
	        this.Vars = source["Vars"];
	        this.WithoutParentheses = source["WithoutParentheses"];
	    }
	}
	export class Where {
	    Exprs: any[];
	
	    static createFrom(source: any = {}) {
	        return new Where(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.Exprs = source["Exprs"];
	    }
	}

}

export namespace gorm {
	
	export class result {
	    Result: any;
	    RowsAffected: number;
	    Error: any;
	
	    static createFrom(source: any = {}) {
	        return new result(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.Result = source["Result"];
	        this.RowsAffected = source["RowsAffected"];
	        this.Error = source["Error"];
	    }
	}
	export class join {
	    Name: string;
	    Alias: string;
	    Conds: any[];
	    On?: clause.Where;
	    Selects: string[];
	    Omits: string[];
	    Expression: any;
	    JoinType: string;
	
	    static createFrom(source: any = {}) {
	        return new join(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.Name = source["Name"];
	        this.Alias = source["Alias"];
	        this.Conds = source["Conds"];
	        this.On = this.convertValues(source["On"], clause.Where);
	        this.Selects = source["Selects"];
	        this.Omits = source["Omits"];
	        this.Expression = source["Expression"];
	        this.JoinType = source["JoinType"];
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice && a.map) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}
	export class Statement {
	    SkipDefaultTransaction: boolean;
	    DefaultTransactionTimeout: number;
	    DefaultContextTimeout: number;
	    NamingStrategy: any;
	    FullSaveAssociations: boolean;
	    Logger: any;
	    DryRun: boolean;
	    PrepareStmt: boolean;
	    PrepareStmtMaxSize: number;
	    PrepareStmtTTL: number;
	    DisableAutomaticPing: boolean;
	    DisableForeignKeyConstraintWhenMigrating: boolean;
	    IgnoreRelationshipsWhenMigrating: boolean;
	    DisableNestedTransaction: boolean;
	    AllowGlobalUpdate: boolean;
	    QueryFields: boolean;
	    CreateBatchSize: number;
	    TranslateError: boolean;
	    PropagateUnscoped: boolean;
	    ClauseBuilders: Record<string, ClauseBuilder>;
	    ConnPool: any;
	    Dialector: any;
	    Plugins: Record<string, any>;
	    Error: any;
	    RowsAffected: number;
	    Statement?: Statement;
	    TableExpr?: clause.Expr;
	    Table: string;
	    Model: any;
	    Unscoped: boolean;
	    Dest: any;
	    // Go type: reflect
	    ReflectValue: any;
	    Clauses: Record<string, clause.Clause>;
	    BuildClauses: string[];
	    Distinct: boolean;
	    Selects: string[];
	    Omits: string[];
	    ColumnMapping: Record<string, string>;
	    Joins: join[];
	    Preloads: Record<string, Array<any>>;
	    // Go type: sync
	    Settings: any;
	    ConnPool: any;
	    Schema?: schema.Schema;
	    Context: any;
	    RaiseErrorOnNotFound: boolean;
	    SkipHooks: boolean;
	    // Go type: strings
	    SQL: any;
	    Vars: any[];
	    CurDestIndex: number;
	    Result?: result;
	
	    static createFrom(source: any = {}) {
	        return new Statement(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.SkipDefaultTransaction = source["SkipDefaultTransaction"];
	        this.DefaultTransactionTimeout = source["DefaultTransactionTimeout"];
	        this.DefaultContextTimeout = source["DefaultContextTimeout"];
	        this.NamingStrategy = source["NamingStrategy"];
	        this.FullSaveAssociations = source["FullSaveAssociations"];
	        this.Logger = source["Logger"];
	        this.DryRun = source["DryRun"];
	        this.PrepareStmt = source["PrepareStmt"];
	        this.PrepareStmtMaxSize = source["PrepareStmtMaxSize"];
	        this.PrepareStmtTTL = source["PrepareStmtTTL"];
	        this.DisableAutomaticPing = source["DisableAutomaticPing"];
	        this.DisableForeignKeyConstraintWhenMigrating = source["DisableForeignKeyConstraintWhenMigrating"];
	        this.IgnoreRelationshipsWhenMigrating = source["IgnoreRelationshipsWhenMigrating"];
	        this.DisableNestedTransaction = source["DisableNestedTransaction"];
	        this.AllowGlobalUpdate = source["AllowGlobalUpdate"];
	        this.QueryFields = source["QueryFields"];
	        this.CreateBatchSize = source["CreateBatchSize"];
	        this.TranslateError = source["TranslateError"];
	        this.PropagateUnscoped = source["PropagateUnscoped"];
	        this.ClauseBuilders = source["ClauseBuilders"];
	        this.ConnPool = source["ConnPool"];
	        this.Dialector = source["Dialector"];
	        this.Plugins = source["Plugins"];
	        this.Error = source["Error"];
	        this.RowsAffected = source["RowsAffected"];
	        this.Statement = this.convertValues(source["Statement"], Statement);
	        this.TableExpr = this.convertValues(source["TableExpr"], clause.Expr);
	        this.Table = source["Table"];
	        this.Model = source["Model"];
	        this.Unscoped = source["Unscoped"];
	        this.Dest = source["Dest"];
	        this.ReflectValue = this.convertValues(source["ReflectValue"], null);
	        this.Clauses = this.convertValues(source["Clauses"], clause.Clause, true);
	        this.BuildClauses = source["BuildClauses"];
	        this.Distinct = source["Distinct"];
	        this.Selects = source["Selects"];
	        this.Omits = source["Omits"];
	        this.ColumnMapping = source["ColumnMapping"];
	        this.Joins = this.convertValues(source["Joins"], join);
	        this.Preloads = source["Preloads"];
	        this.Settings = this.convertValues(source["Settings"], null);
	        this.ConnPool = source["ConnPool"];
	        this.Schema = this.convertValues(source["Schema"], schema.Schema);
	        this.Context = source["Context"];
	        this.RaiseErrorOnNotFound = source["RaiseErrorOnNotFound"];
	        this.SkipHooks = source["SkipHooks"];
	        this.SQL = this.convertValues(source["SQL"], null);
	        this.Vars = source["Vars"];
	        this.CurDestIndex = source["CurDestIndex"];
	        this.Result = this.convertValues(source["Result"], result);
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice && a.map) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}
	export class DB {
	    SkipDefaultTransaction: boolean;
	    DefaultTransactionTimeout: number;
	    DefaultContextTimeout: number;
	    NamingStrategy: any;
	    FullSaveAssociations: boolean;
	    Logger: any;
	    DryRun: boolean;
	    PrepareStmt: boolean;
	    PrepareStmtMaxSize: number;
	    PrepareStmtTTL: number;
	    DisableAutomaticPing: boolean;
	    DisableForeignKeyConstraintWhenMigrating: boolean;
	    IgnoreRelationshipsWhenMigrating: boolean;
	    DisableNestedTransaction: boolean;
	    AllowGlobalUpdate: boolean;
	    QueryFields: boolean;
	    CreateBatchSize: number;
	    TranslateError: boolean;
	    PropagateUnscoped: boolean;
	    ClauseBuilders: Record<string, ClauseBuilder>;
	    ConnPool: any;
	    Dialector: any;
	    Plugins: Record<string, any>;
	    Error: any;
	    RowsAffected: number;
	    Statement?: Statement;
	
	    static createFrom(source: any = {}) {
	        return new DB(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.SkipDefaultTransaction = source["SkipDefaultTransaction"];
	        this.DefaultTransactionTimeout = source["DefaultTransactionTimeout"];
	        this.DefaultContextTimeout = source["DefaultContextTimeout"];
	        this.NamingStrategy = source["NamingStrategy"];
	        this.FullSaveAssociations = source["FullSaveAssociations"];
	        this.Logger = source["Logger"];
	        this.DryRun = source["DryRun"];
	        this.PrepareStmt = source["PrepareStmt"];
	        this.PrepareStmtMaxSize = source["PrepareStmtMaxSize"];
	        this.PrepareStmtTTL = source["PrepareStmtTTL"];
	        this.DisableAutomaticPing = source["DisableAutomaticPing"];
	        this.DisableForeignKeyConstraintWhenMigrating = source["DisableForeignKeyConstraintWhenMigrating"];
	        this.IgnoreRelationshipsWhenMigrating = source["IgnoreRelationshipsWhenMigrating"];
	        this.DisableNestedTransaction = source["DisableNestedTransaction"];
	        this.AllowGlobalUpdate = source["AllowGlobalUpdate"];
	        this.QueryFields = source["QueryFields"];
	        this.CreateBatchSize = source["CreateBatchSize"];
	        this.TranslateError = source["TranslateError"];
	        this.PropagateUnscoped = source["PropagateUnscoped"];
	        this.ClauseBuilders = source["ClauseBuilders"];
	        this.ConnPool = source["ConnPool"];
	        this.Dialector = source["Dialector"];
	        this.Plugins = source["Plugins"];
	        this.Error = source["Error"];
	        this.RowsAffected = source["RowsAffected"];
	        this.Statement = this.convertValues(source["Statement"], Statement);
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice && a.map) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}
	
	

}

export namespace main {
	
	export class Response {
	    code: number;
	    message: string;
	    data?: any;
	
	    static createFrom(source: any = {}) {
	        return new Response(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.code = source["code"];
	        this.message = source["message"];
	        this.data = source["data"];
	    }
	}

}

export namespace reflect {
	
	export class StructField {
	    Name: string;
	    PkgPath: string;
	    Type: any;
	    Tag: string;
	    Offset: any;
	    Index: number[];
	    Anonymous: boolean;
	
	    static createFrom(source: any = {}) {
	        return new StructField(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.Name = source["Name"];
	        this.PkgPath = source["PkgPath"];
	        this.Type = source["Type"];
	        this.Tag = source["Tag"];
	        this.Offset = source["Offset"];
	        this.Index = source["Index"];
	        this.Anonymous = source["Anonymous"];
	    }
	}

}

export namespace schema {
	
	export class Reference {
	    PrimaryKey?: Field;
	    PrimaryValue: string;
	    ForeignKey?: Field;
	    OwnPrimaryKey: boolean;
	
	    static createFrom(source: any = {}) {
	        return new Reference(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.PrimaryKey = this.convertValues(source["PrimaryKey"], Field);
	        this.PrimaryValue = source["PrimaryValue"];
	        this.ForeignKey = this.convertValues(source["ForeignKey"], Field);
	        this.OwnPrimaryKey = source["OwnPrimaryKey"];
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice && a.map) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}
	export class Polymorphic {
	    PolymorphicID?: Field;
	    PolymorphicType?: Field;
	    Value: string;
	
	    static createFrom(source: any = {}) {
	        return new Polymorphic(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.PolymorphicID = this.convertValues(source["PolymorphicID"], Field);
	        this.PolymorphicType = this.convertValues(source["PolymorphicType"], Field);
	        this.Value = source["Value"];
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice && a.map) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}
	export class Relationship {
	    Name: string;
	    Type: string;
	    Field?: Field;
	    Polymorphic?: Polymorphic;
	    References: Reference[];
	    Schema?: Schema;
	    FieldSchema?: Schema;
	    JoinTable?: Schema;
	
	    static createFrom(source: any = {}) {
	        return new Relationship(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.Name = source["Name"];
	        this.Type = source["Type"];
	        this.Field = this.convertValues(source["Field"], Field);
	        this.Polymorphic = this.convertValues(source["Polymorphic"], Polymorphic);
	        this.References = this.convertValues(source["References"], Reference);
	        this.Schema = this.convertValues(source["Schema"], Schema);
	        this.FieldSchema = this.convertValues(source["FieldSchema"], Schema);
	        this.JoinTable = this.convertValues(source["JoinTable"], Schema);
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice && a.map) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}
	export class Relationships {
	    HasOne: Relationship[];
	    BelongsTo: Relationship[];
	    HasMany: Relationship[];
	    Many2Many: Relationship[];
	    Relations: Record<string, Relationship>;
	    EmbeddedRelations: Record<string, Relationships>;
	    // Go type: sync
	    Mux: any;
	
	    static createFrom(source: any = {}) {
	        return new Relationships(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.HasOne = this.convertValues(source["HasOne"], Relationship);
	        this.BelongsTo = this.convertValues(source["BelongsTo"], Relationship);
	        this.HasMany = this.convertValues(source["HasMany"], Relationship);
	        this.Many2Many = this.convertValues(source["Many2Many"], Relationship);
	        this.Relations = this.convertValues(source["Relations"], Relationship, true);
	        this.EmbeddedRelations = this.convertValues(source["EmbeddedRelations"], Relationships, true);
	        this.Mux = this.convertValues(source["Mux"], null);
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice && a.map) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}
	export class Schema {
	    Name: string;
	    ModelType: any;
	    Table: string;
	    PrioritizedPrimaryField?: Field;
	    DBNames: string[];
	    PrimaryFields: Field[];
	    PrimaryFieldDBNames: string[];
	    Fields: Field[];
	    FieldsByName: Record<string, Field>;
	    FieldsByBindName: Record<string, Field>;
	    FieldsByDBName: Record<string, Field>;
	    FieldsWithDefaultDBValue: Field[];
	    Relationships: Relationships;
	    CreateClauses: any[];
	    QueryClauses: any[];
	    UpdateClauses: any[];
	    DeleteClauses: any[];
	    BeforeCreate: boolean;
	    AfterCreate: boolean;
	    BeforeUpdate: boolean;
	    AfterUpdate: boolean;
	    BeforeDelete: boolean;
	    AfterDelete: boolean;
	    BeforeSave: boolean;
	    AfterSave: boolean;
	    AfterFind: boolean;
	
	    static createFrom(source: any = {}) {
	        return new Schema(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.Name = source["Name"];
	        this.ModelType = source["ModelType"];
	        this.Table = source["Table"];
	        this.PrioritizedPrimaryField = this.convertValues(source["PrioritizedPrimaryField"], Field);
	        this.DBNames = source["DBNames"];
	        this.PrimaryFields = this.convertValues(source["PrimaryFields"], Field);
	        this.PrimaryFieldDBNames = source["PrimaryFieldDBNames"];
	        this.Fields = this.convertValues(source["Fields"], Field);
	        this.FieldsByName = this.convertValues(source["FieldsByName"], Field, true);
	        this.FieldsByBindName = this.convertValues(source["FieldsByBindName"], Field, true);
	        this.FieldsByDBName = this.convertValues(source["FieldsByDBName"], Field, true);
	        this.FieldsWithDefaultDBValue = this.convertValues(source["FieldsWithDefaultDBValue"], Field);
	        this.Relationships = this.convertValues(source["Relationships"], Relationships);
	        this.CreateClauses = source["CreateClauses"];
	        this.QueryClauses = source["QueryClauses"];
	        this.UpdateClauses = source["UpdateClauses"];
	        this.DeleteClauses = source["DeleteClauses"];
	        this.BeforeCreate = source["BeforeCreate"];
	        this.AfterCreate = source["AfterCreate"];
	        this.BeforeUpdate = source["BeforeUpdate"];
	        this.AfterUpdate = source["AfterUpdate"];
	        this.BeforeDelete = source["BeforeDelete"];
	        this.AfterDelete = source["AfterDelete"];
	        this.BeforeSave = source["BeforeSave"];
	        this.AfterSave = source["AfterSave"];
	        this.AfterFind = source["AfterFind"];
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice && a.map) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}
	export class Field {
	    Name: string;
	    DBName: string;
	    BindNames: string[];
	    EmbeddedBindNames: string[];
	    DataType: string;
	    GORMDataType: string;
	    PrimaryKey: boolean;
	    AutoIncrement: boolean;
	    AutoIncrementIncrement: number;
	    Creatable: boolean;
	    Updatable: boolean;
	    Readable: boolean;
	    AutoCreateTime: number;
	    AutoUpdateTime: number;
	    HasDefaultValue: boolean;
	    DefaultValue: string;
	    DefaultValueInterface: any;
	    NotNull: boolean;
	    Unique: boolean;
	    Comment: string;
	    Size: number;
	    Precision: number;
	    Scale: number;
	    IgnoreMigration: boolean;
	    FieldType: any;
	    IndirectFieldType: any;
	    StructField: reflect.StructField;
	    Tag: string;
	    TagSettings: Record<string, string>;
	    Schema?: Schema;
	    EmbeddedSchema?: Schema;
	    OwnerSchema?: Schema;
	    Serializer: any;
	    NewValuePool: any;
	    UniqueIndex: string;
	
	    static createFrom(source: any = {}) {
	        return new Field(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.Name = source["Name"];
	        this.DBName = source["DBName"];
	        this.BindNames = source["BindNames"];
	        this.EmbeddedBindNames = source["EmbeddedBindNames"];
	        this.DataType = source["DataType"];
	        this.GORMDataType = source["GORMDataType"];
	        this.PrimaryKey = source["PrimaryKey"];
	        this.AutoIncrement = source["AutoIncrement"];
	        this.AutoIncrementIncrement = source["AutoIncrementIncrement"];
	        this.Creatable = source["Creatable"];
	        this.Updatable = source["Updatable"];
	        this.Readable = source["Readable"];
	        this.AutoCreateTime = source["AutoCreateTime"];
	        this.AutoUpdateTime = source["AutoUpdateTime"];
	        this.HasDefaultValue = source["HasDefaultValue"];
	        this.DefaultValue = source["DefaultValue"];
	        this.DefaultValueInterface = source["DefaultValueInterface"];
	        this.NotNull = source["NotNull"];
	        this.Unique = source["Unique"];
	        this.Comment = source["Comment"];
	        this.Size = source["Size"];
	        this.Precision = source["Precision"];
	        this.Scale = source["Scale"];
	        this.IgnoreMigration = source["IgnoreMigration"];
	        this.FieldType = source["FieldType"];
	        this.IndirectFieldType = source["IndirectFieldType"];
	        this.StructField = this.convertValues(source["StructField"], reflect.StructField);
	        this.Tag = source["Tag"];
	        this.TagSettings = source["TagSettings"];
	        this.Schema = this.convertValues(source["Schema"], Schema);
	        this.EmbeddedSchema = this.convertValues(source["EmbeddedSchema"], Schema);
	        this.OwnerSchema = this.convertValues(source["OwnerSchema"], Schema);
	        this.Serializer = source["Serializer"];
	        this.NewValuePool = source["NewValuePool"];
	        this.UniqueIndex = source["UniqueIndex"];
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice && a.map) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}
	
	
	
	

}

